from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import json
import logging
from equipe_agents_pv import Crew, Agent, Task
import uvicorn

# Configuração de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

logger = logging.getLogger(__name__)

app = FastAPI()

class WebSocketManager:
    def __init__(self):
        self.active_connections: dict[int, WebSocket] = {}
        self.next_id = 1  # Counter for the next client ID

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        client_id = self.next_id  # Assign the current ID
        self.active_connections[client_id] = websocket  # Store the connection with the ID
        logger.info(f"Client connected: {client_id}")  # Log the client ID
        self.next_id += 1  # Increment the ID for the next client

    async def disconnect(self, websocket: WebSocket):
        # Find the client ID associated with the websocket
        client_id = next((id for id, conn in self.active_connections.items() if conn == websocket), None)
        if client_id is not None:
            del self.active_connections[client_id]
            logger.info(f"Client disconnected: {client_id}")
    async def send_message(self, websocket: WebSocket, message: str):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections.values():
            await connection.send_text(message)

manager = WebSocketManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await process_message(websocket, data)
    except WebSocketDisconnect:
        await manager.disconnect(websocket)

async def process_message(websocket: WebSocket, message: str):
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
            markdown_result = format_results_as_markdown(tema, results)

            # Send response with markdown
            response = {
                'type': 'task_results',
                'status': 'success',
                'results': results,
                'markdown_result': markdown_result
            }
            await manager.send_message(websocket, json.dumps(response))

    except Exception as e:
        logger.error(f"Error processing message: {str(e)}")
        response = {
            'type': 'error',
            'message': str(e)
        }
        await manager.send_message(websocket, json.dumps(response))

def format_results_as_markdown(tema, results):
    """Format the results as markdown."""
    markdown = f"# Análise: {tema}\n\n"
    
    for i, result in enumerate(results, 1):
        markdown += f"\n## Resultado {i}\n\n"
        markdown += f"{result}\n\n"
        markdown += "---\n\n"
    
    return markdown

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=9400)