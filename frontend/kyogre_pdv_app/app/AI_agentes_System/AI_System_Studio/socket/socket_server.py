import socket
import threading
import base64
import hashlib
import json
import logging
import select
from equipe_agents_pv import Crew, Agent, Task


# Configuração de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

logger = logging.getLogger(__name__)

# Resposta de handshake WebSocket
HANDSHAKE_RESPONSE = (
    "HTTP/1.1 101 Switching Protocols\r\n"
    "Upgrade: websocket\r\n"
    "Connection: Upgrade\r\n"
    "Sec-WebSocket-Accept: {accept_key}\r\n\r\n"
)

def is_socket_ready(sock, timeout=1.0):
    """Verifica se o socket está pronto para leitura dentro do tempo especificado."""
    try:
        ready_to_read, _, _ = select.select([sock], [], [], timeout)
        return bool(ready_to_read)
    except Exception as e:
        logger.error(f"Erro ao verificar estado do socket: {e}")
        return False

class WebSocketServer:
    def __init__(self, host='0.0.0.0', port=8000):
        self.host = host
        self.port = port
        self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.connections = set()

    def start(self):
        self.server_socket.bind((self.host, self.port))
        self.server_socket.listen(5)
        logger.info(f"WebSocket server started on port {self.port}")

        while True:
            client_socket, addr = self.server_socket.accept()
            logger.info(f"Connection from {addr}")
            client_handler = threading.Thread(
                target=self.handle_client_connection,
                args=(client_socket,)
            )
            client_handler.start()

    def handle_client_connection(self, client_socket):
        """Processa a conexão do cliente e realiza o handshake WebSocket."""
        try:
            request = client_socket.recv(1024).decode('utf-8')
            headers = self.parse_headers(request)
            websocket_accept_key = self.create_accept_key(headers.get('Sec-WebSocket-Key', ''))
            response = HANDSHAKE_RESPONSE.format(accept_key=websocket_accept_key)
            client_socket.send(response.encode('utf-8'))

            while True:
                if not is_socket_ready(client_socket):
                    logger.warning("Socket não está pronto para leitura.")
                #    break

                message = self.receive_message(client_socket)
                if message is None:  # Conexão encerrada ou erro
                    break
                self.process_message(client_socket, message)
                
        except (OSError, ConnectionResetError) as e:
            logger.error(f"Erro na conexão: {e}")
        finally:
            self.close_socket(client_socket)  # Se você quiser garantir o fechamento, pode manter isso.

    def close_socket(self, client_socket):
        """Fecha o socket de forma segura, se estiver aberto."""
        try:
            if not client_socket.fileno() == -1:  # Verifica se o socket está fechado
                client_socket.close()
        except OSError as e:
            logger.error(f"Erro ao fechar o socket: {e}")

    def process_message(self, client_socket, message):
        try:
            if not message.strip():
                logger.warning("Mensagem vazia recebida.")
                return
            data = json.loads(message)
            message_type = data.get('type')

            if message_type == 'start_tasks':
                tema = data['data']['tema']
                agents_data = data['data']['agents']
                tasks_data = data['data']['tasks']

                # Create agents with proper data
                agents = [
                    Agent(
                        role=agent['role'],
                        goal=agent['goal'],
                        backstory=agent['backstory']
                    ) for agent in agents_data
                ]

                # Create tasks with proper agent assignments
                tasks = [
                    Task(
                        description=task['description'],
                        agent=agents[task['agentId'] - 1],
                        expected_output=task['expected_output'],
                        attempts=task['attempts']
                    ) for task in tasks_data
                ]

                # Initialize crew and execute tasks
                crew = Crew(agents=agents, tasks=tasks)
                results = crew.kickoff({'tema': tema})

                # Format results as markdown
                markdown_result = self.format_results_as_markdown(tema, results)

                # Send response with markdown
                response = {
                    'type': 'task_results',
                    'status': 'success',
                    'results': results,
                    'markdown_result': markdown_result
                }
                
                #logger.info(f"Sending results: {response}")
                self.send_message(client_socket, json.dumps(response))
                
                # O socket permanece aberto até que o cliente ou o servidor decida fechar a conexão.
                # Você pode adicionar lógica para fechar o socket aqui quando necessário.

        except Exception as e:
            logger.error(f"Error processing message: {str(e)}")
            response = {
                'type': 'error',
                'message': str(e)
            }
            self.send_message(client_socket, json.dumps(response))


    def parse_headers(self, request):
        """Analisa os cabeçalhos da requisição WebSocket."""
        headers = {}
        lines = request.split("\r\n")
        for line in lines[1:]:
            if line:
                key, value = line.split(": ", 1)
                headers[key] = value
        return headers

    def create_accept_key(self, sec_websocket_key):
        """Cria a chave de aceite para o WebSocket a partir da chave fornecida."""
        GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'
        accept_key = sec_websocket_key + GUID
        hashed_key = hashlib.sha1(accept_key.encode('utf-8')).digest()
        return base64.b64encode(hashed_key).decode('utf-8')

    def receive_message(self, client_socket):
        """Recebe e processa uma mensagem do cliente."""
        try:
            header = client_socket.recv(2)
            if len(header) < 2:
                logger.warning("Header incompleto recebido. Encerrando conexão.")
                return None

            byte1, byte2 = header
            opcode = byte1 & 0b00001111
            masked = byte2 & 0b10000000
            payload_length = byte2 & 0b01111111

            if masked != 128:
                logger.error("Quadros do cliente não estão mascarados.")
                return None

            if payload_length == 126:
                payload_length = int.from_bytes(client_socket.recv(2), 'big')
            elif payload_length == 127:
                payload_length = int.from_bytes(client_socket.recv(8), 'big')

            masks = client_socket.recv(4)
            if len(masks) < 4:
                logger.warning("Máscaras incompletas recebidas.")
                return None

            message_bytes = bytearray(client_socket.recv(payload_length))
            for i in range(payload_length):
                message_bytes[i] ^= masks[i % 4]

            return message_bytes.decode('utf-8', errors='replace')
        except Exception as e:
            logger.error(f"Erro ao receber mensagem: {e}")
            return None

    def send_message(self, client_socket, message):
        """Envia uma mensagem ao cliente via WebSocket."""
        message = message.encode('utf-8')
        byte1 = 0b10000001
        length = len(message)

        if length <= 125:
            header = bytes([byte1, length])
        elif length <= 65535:
            header = bytes([byte1, 126]) + length.to_bytes(2, 'big')
        else:
            header = bytes([byte1, 127]) + length.to_bytes(8, 'big')

        client_socket.send(header + message)
    
    def format_results_as_markdown(self, tema, results):
        """Format the results as markdown."""
        markdown = f"# Análise: {tema}\n\n"
        
        for i, result in enumerate(results, 1):
            markdown += f"## Resultado {i}\n\n"
            markdown += f"{result}\n\n"
            markdown += "---\n\n"
        
        return markdown


if __name__ == '__main__':
    ws_server = WebSocketServer()
    ws_server.start()
