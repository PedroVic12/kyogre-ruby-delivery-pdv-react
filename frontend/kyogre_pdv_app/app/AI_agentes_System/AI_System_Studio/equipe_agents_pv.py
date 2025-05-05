import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()


# Configure the Gemini API
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)

# Initialize the model
model = genai.GenerativeModel('gemini-pro')
if model:
    print("Modelo iniciado com sucesso!")
else:
    print("Erro ao iniciar o modelo.")

class Agent:
    def __init__(self, role, goal, backstory):
        self.role = role
        self.goal = goal
        self.backstory = backstory
    
    def execute(self, task, attempts, tema):
        results = []
        for i in range(attempts):
            prompt = f"""
Role: {self.role}
Goal: {self.goal}
Backstory: {self.backstory}

Context: You are working on the following topic: {tema}

Tasks to complete:
{task.description}

Please provide your response in markdown format, including:
- Headers for different sections
- Bullet points where appropriate
- Emphasis on important points
- Clear structure and organization

Expected Output: {task.expected_output}
Attempt: {i+1}/{attempts}
"""
            try:
                response = model.generate_content(prompt)
                results.append(response.text)
            except Exception as e:
                print(f"Error in attempt {i+1}: {str(e)}")
                results.append(f"Error in attempt {i+1}: {str(e)}")
        
        # Consolidate results
        if len(results) > 1:
            consolidated_prompt = f"""
Please consolidate these {attempts} attempts into a final, well-structured markdown response:

{results}

Ensure the response is well-formatted in markdown with:
- Clear headers
- Proper sections
- Bullet points where appropriate
- Emphasis on key points
"""
            try:
                final_response = model.generate_content(consolidated_prompt)
                return final_response.text
            except Exception as e:
                print(f"Error in consolidation: {str(e)}")
                return results[-1]  # Return the last result if consolidation fails
        else:
            return results[0] if results else "No results generated"

    def gerar_markdown(self, content):
        # Formatting content for markdown
        formatted_content = content.replace("\\n", "\n\n")  # Two line breaks for paragraphs
        
        try:
            # Create markdown file
            path = "/home/pedrov12/Documentos/GitHub/Gerador-Agentes-IA-DashJS/backend/websocket/output"
            output_dir = os.path.join(os.getcwd(), 'output')
            os.makedirs(output_dir, exist_ok=True)
            with open(f'{path}/documento.md', 'w', encoding='utf-8') as f:
                f.write(formatted_content)
            print("Relatório gerado em 'documento.md'.")
        except Exception as e:
            print(f"\nErro ao criar o arquivo: {e}")

class Task:
    def __init__(self, description, agent, expected_output, attempts):
        self.description = description
        self.agent = agent
        self.expected_output = expected_output
        self.attempts = attempts
        print(f"\n>>> Tarefa: {description} do Agente:{agent.role}\n\nTarefa criada com sucesso!")

class Crew:
    def __init__(self, agents, tasks):
        self.agents = agents
        self.tasks = tasks
    
    def kickoff(self, inputs):
        results = []
        tarefas_executadas = 0

        for task in self.tasks:
            try:
                result = task.agent.execute(task, task.attempts, inputs['tema'])
                results.append(result)
                tarefas_executadas += 1
            except Exception as e:
                print(f"Error executing task: {str(e)}")
                results.append(f"Error executing task: {str(e)}")

            print(f"\nTarefa {tarefas_executadas} concluida com sucesso!")

        return results


def run_crewai_pv():
    # Define the theme
    tema = "Como trabalhar com frontend React e backend em python com crud e sqlite "
    entradas = {"tema": tema}

    # Define agents
    buscador = Agent(
        role="Pesquisador",
        goal="Pesquisar informações relevantes sobre o assunto",
        backstory="Você é um pesquisador experiente e está sempre em busca de informações relevantes."
    )

    redator = Agent(
        role="Redator",
        goal="Escrever um artigo informativo sobre o assunto",
        backstory="Você é um redator experiente e está sempre buscando escrita limpa e facil de entendimento."
    )

    # Define tasks
    pesquisa = Task(
        description=f"Pesquisar sobre {tema} com as fontes mais recentes e confiáveis",
        agent=buscador,
        expected_output="Um relatório  com parágrafos contendo Introdução, Desenvolvimento, e Conclusão",
        attempts=2
    )

    escrita = Task(
        description=f"Escrever um artigo em formato markdown sobre {tema} com base na pesquisa realizada",
        agent=redator,
        expected_output="Arquivo markdown bem escrito e objetivo de forma didática",
        attempts=2
    )

    # Create the crew
    equipe = Crew(
        agents=[buscador, redator],
        tasks=[pesquisa, escrita]
    )


    # Execute tasks
    results = equipe.kickoff(inputs=entradas)

    # Display results and generate markdown
    print("\n\nResultados das Tarefas da Equipe:")
    for i, result in enumerate(results):
        print(result)
        print("\n---\n")
        if i == 1:  # Generate markdown for the second task (writing task)
            redator.gerar_markdown(result)


#run_crewai_pv()
