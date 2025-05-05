from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
from equipe_agents_pv import Crew, Agent, Task
import os
import traceback
import logging
import json

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading', manage_session=False)

# Default agents configuration
DEFAULT_AGENTS = [
    {
        "id": 1,
        "name": "Pesquisador",
        "role": "Pesquisador",
        "goal": "Pesquisar informações relevantes sobre o assunto",
        "backstory": "Você é um pesquisador experiente e está sempre em busca de informações relevantes.",
        "tasks": ["Pesquisar sobre o tema com as fontes mais recentes e confiáveis"],
        "expected_output": "Um relatório com parágrafos contendo Introdução, Desenvolvimento, e Conclusão"
    },
    {
        "id": 2,
        "name": "Redator",
        "role": "Redator",
        "goal": "Escrever um artigo informativo sobre o assunto",
        "backstory": "Você é um redator experiente e está sempre buscando escrita limpa e facil de entendimento.",
        "tasks": ["Escrever um artigo em formato markdown sobre o tema com base na pesquisa realizada"],
        "expected_output": "Arquivo markdown bem escrito e objetivo de forma didática"
    }
]

def create_agent_from_data(agent_data):
    try:
        logger.info(f"🤖 Criando agente: {agent_data.get('name')}")
        agent = Agent(
            role=agent_data.get('role', ''),
            goal=agent_data.get('goal', ''),
            backstory=agent_data.get('backstory', '')
        )
        logger.info(f"✅ Agente {agent_data.get('name')} criado com sucesso")
        return agent
    except Exception as e:
        logger.error(f"❌ Erro ao criar agente: {str(e)}")
        raise

def create_tasks_for_agent(agent, agent_data, tema):
    try:
        logger.info(f"📝 Criando tarefas para o agente: {agent_data.get('name')}")
        tasks = agent_data.get('tasks', [])
        task_descriptions = []
        for task in tasks:
            task_descriptions.append(f"- {task}")
        
        description = f"""
Contexto: {tema}

Tarefas a serem realizadas:
{chr(10).join(task_descriptions)}

Role: {agent_data.get('role')}
Goal: {agent_data.get('goal')}
"""
        
        task = Task(
            description=description,
            agent=agent,
            expected_output=agent_data.get('expected_output', "Resultado em formato markdown com estrutura clara e objetiva"),
            attempts=2
        )
        logger.info(f"✅ Tarefas criadas com sucesso para {agent_data.get('name')}")
        return task
    except Exception as e:
        logger.error(f"❌ Erro ao criar tarefas: {str(e)}")
        raise

@app.route('/')
def index():
    return "WebSocket server is running"

@socketio.on('connect')
def handle_connect():
    logger.info('🟢 Cliente conectado ao WebSocket')
    socketio.emit('default_agents', {'agents': DEFAULT_AGENTS})
    socketio.emit('connection_status', {
        'status': 'connected',
        'message': 'Conexão estabelecida com sucesso!'
    })
    logger.info('📤 Configuração padrão dos agentes enviada')

@socketio.on('disconnect')
def handle_disconnect():
    logger.info('🔴 Cliente desconectado do WebSocket')

@socketio.on('check_configuration')
def handle_check_configuration(data):
    try:
        agents_data = data.get('agents', [])
        prompt = data.get('prompt', '')
        
        # Check if we have at least one agent and a non-empty prompt
        is_valid = len(agents_data) > 0 and bool(prompt.strip())
        
        logger.info(f'🔍 Verificando configuração:')
        logger.info(f'  - Agentes: {"✅" if agents_data else "❌"} ({len(agents_data)} agentes)')
        logger.info(f'  - Prompt: {"✅" if prompt.strip() else "❌"}')
        
        socketio.emit('configuration_status', {
            'is_valid': is_valid,
            'message': 'Configuração válida' if is_valid else 'Complete a configuração dos agentes e o prompt'
        })
        
        logger.info(f'🔍 Status da configuração: {"✅ Válida" if is_valid else "❌ Inválida"}')
    except Exception as e:
        logger.error(f'❌ Erro na verificação de configuração: {str(e)}')
        socketio.emit('configuration_status', {
            'is_valid': False,
            'message': f'Erro na verificação: {str(e)}'
        })

@socketio.on('start_tasks')
def handle_start_tasks(data):
    try:
        logger.info("\n=== 🚀 Iniciando Execução das Tarefas ===")
        logger.info(f"📥 Dados recebidos: {json.dumps(data, indent=2, ensure_ascii=False)}")
        
        agents_data = data.get('agents', [])
        prompt = data.get('prompt', '')
        
        if not prompt.strip():
            raise ValueError("❌ O prompt não pode estar vazio")
        
        if not agents_data:
            raise ValueError("❌ Nenhum agente selecionado")

        logger.info(f"\n📝 Processando prompt: {prompt}")
        logger.info(f"👥 Número de agentes: {len(agents_data)}")

        # Create agents and tasks
        all_agents = []
        all_tasks = []

        for agent_data in agents_data:
            try:
                logger.info(f"\n🤖 Processando agente: {agent_data.get('name')}")
                agent = create_agent_from_data(agent_data)
                all_agents.append(agent)
                
                task = create_tasks_for_agent(agent, agent_data, prompt)
                all_tasks.append(task)
                logger.info(f"✅ Agente {agent_data.get('name')} configurado com sucesso")
            except Exception as e:
                logger.error(f"❌ Erro no processamento do agente {agent_data.get('name')}: {str(e)}")
                raise

        # Create and execute crew
        logger.info("\n👥 Criando equipe e iniciando execução...")
        equipe = Crew(agents=all_agents, tasks=all_tasks)
        
        # Execute tasks
        logger.info("⚙️ Executando tarefas...")
        results = equipe.kickoff(inputs={'tema': prompt})
        
        # Format results
        logger.info("📊 Formatando resultados...")
        markdown_result = "# 📋 Resultado da Execução\n\n"
        
        for i, (agent_data, result) in enumerate(zip(agents_data, results)):
            markdown_result += f"## 🤖 Agente: {agent_data['name']}\n\n"
            markdown_result += f"### 📌 Papel: {agent_data['role']}\n\n"
            markdown_result += f"{result}\n\n"
            markdown_result += "---\n\n"

        # Generate markdown file
        try:
            output_dir = os.path.join(os.path.dirname(__file__), 'output')
            os.makedirs(output_dir, exist_ok=True)
            markdown_path = os.path.join(output_dir, 'resultado.md')
            with open(markdown_path, 'w', encoding='utf-8') as f:
                f.write(markdown_result)
            logger.info(f"📝 Arquivo markdown gerado: {markdown_path}")
        except Exception as e:
            logger.error(f"❌ Erro ao salvar arquivo markdown: {str(e)}")

        logger.info("✨ Execução concluída com sucesso!")
        socketio.emit('task_results', {
            'status': 'success',
            'markdown_result': markdown_result
        })
        logger.info("📤 Resultados enviados para o cliente")
        
    except Exception as e:
        error_traceback = traceback.format_exc()
        logger.error(f"❌ Erro durante a execução: {str(e)}")
        logger.error(f"📜 Traceback: {error_traceback}")
        
        error_message = f"""# ❌ Erro na Execução

## 📋 Detalhes do Erro:
```python
{str(e)}
```

### 📜 Traceback:
```python
{error_traceback}
```

Por favor, tente novamente ou contate o suporte se o erro persistir.
"""
        
        socketio.emit('task_results', {
            'status': 'error',
            'markdown_result': error_message
        })
        logger.info("📤 Mensagem de erro enviada para o cliente")

@socketio.on('update_agent')
def handle_update_agent(data):
    try:
        agent_data = data.get('agent', {})
        logger.info(f"🔄 Atualizando agente: {agent_data.get('name')}")
        
        socketio.emit('agent_updated', {
            'status': 'success',
            'agent': agent_data,
            'message': f"Agente {agent_data.get('name')} atualizado com sucesso!"
        })
        logger.info(f"✅ Agente {agent_data.get('name')} atualizado com sucesso")
    except Exception as e:
        error_msg = f"Erro ao atualizar agente: {str(e)}"
        logger.error(f"❌ {error_msg}")
        socketio.emit('agent_updated', {
            'status': 'error',
            'message': error_msg
        })

if __name__ == '__main__':
    logger.info("🚀 Iniciando servidor WebSocket na porta 9400...")
    socketio.run(app, host='0.0.0.0', port=9400, debug=True, allow_unsafe_werkzeug=True)
