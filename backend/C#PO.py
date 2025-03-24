import os
import streamlit as st
import pyodbc
from dotenv import load_dotenv
import google.generativeai as genai
import pandas as pd
from openpyxl import load_workbook
from docx import Document
import cv2
import numpy as np

class C3PO:
    def __init__(self):
        # Carrega as variáveis de ambiente do arquivo .env
        load_dotenv()
        # Configura a API do Google Gemini com a chave da API
        genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
        # Inicializa o modelo Gemini
        self.gemini_model = genai.GenerativeModel('gemini-pro')

    def generate_gemini_response(self, prompt, question):
        """
        Gera uma resposta usando o modelo Gemini.

        Args:
            prompt (str): O prompt a ser usado pelo modelo.
            question (str): A pergunta a ser respondida.

        Returns:
            str: A resposta gerada pelo modelo.
        """
        try:
            response = self.gemini_model.generate_content([prompt, question])
            return response.text
        except Exception as e:
            st.error(f"Erro ao gerar resposta do Gemini: {e}")
            return None

    def execute_sql_query(self, sql, server, database, uid, pwd, driver='{ODBC Driver 17 for SQL Server}'):
        """
        Executa uma consulta SQL no banco de dados SQL Server.

        Args:
            sql (str): A consulta SQL a ser executada.
            server (str): O nome do servidor do banco de dados.
            database (str): O nome do banco de dados.
            uid (str): O nome de usuário para autenticação.
            pwd (str): A senha para autenticação.
            driver (str, optional): O driver ODBC a ser usado. Padrão: '{ODBC Driver 17 for SQL Server}'.

        Returns:
            tuple: Uma tupla contendo as linhas retornadas pela consulta e os nomes das colunas.
                   Retorna (None, None) em caso de erro.
        """
        conn_str = f"Driver={driver};Server={server};Database={database};UID={uid};PWD={pwd};"
        try:
            with pyodbc.connect(conn_str) as conn:
                cursor = conn.cursor()
                cursor.execute(sql)
                rows = cursor.fetchall()
                # Obtém os nomes das colunas
                columns = [column[0] for column in cursor.description]
                conn.commit()
                return rows, columns  # Retorna as linhas e os nomes das colunas
        except pyodbc.Error as ex:
            sqlstate = ex.args[0]
            st.error(f"Erro no banco de dados: {sqlstate} - {ex}")
            return None, None
        except Exception as e:
            st.error(f"Erro ao executar consulta SQL: {e}")
            return None, None

    def read_excel_file(self, file_path):
        """
        Lê um arquivo Excel usando o Pandas.

        Args:
            file_path (str): O caminho do arquivo Excel.

        Returns:
            pandas.DataFrame: Um DataFrame com os dados do arquivo, ou None em caso de erro.
        """
        try:
            df = pd.read_excel(file_path)
            return df
        except FileNotFoundError:
            st.error(f"Erro: Arquivo não encontrado em {file_path}")
            return None
        except Exception as e:
            st.error(f"Erro ao ler o arquivo XLSX: {e}")
            return None

    def read_docx_file(self, file_path):
        """
        Lê um arquivo DOCX usando a biblioteca docx.

        Args:
            file_path (str): O caminho do arquivo DOCX.

        Returns:
            str: O texto do documento, ou None em caso de erro.
        """
        try:
            document = Document(file_path)
            text = "\n".join([paragraph.text for paragraph in document.paragraphs])
            return text
        except FileNotFoundError:
            st.error(f"Erro: Arquivo não encontrado em {file_path}")
            return None
        except Exception as e:
            st.error(f"Erro ao ler o arquivo DOCX: {e}")
            return None

    def read_image_file(self, file_path):
        """
        Lê um arquivo de imagem usando o OpenCV.

        Args:
            file_path (str): O caminho do arquivo de imagem.

        Returns:
            numpy.ndarray: A imagem como um array NumPy, ou None em caso de erro.
        """
        try:
            img = cv2.imread(file_path)
            return img
        except FileNotFoundError:
            st.error(f"Erro: Arquivo não encontrado em {file_path}")
            return None
        except Exception as e:
            st.error(f"Erro ao ler o arquivo de imagem: {e}")
            return None

    def display_data(self, data, columns=None):
        """
        Exibe os dados no Streamlit de acordo com o tipo.

        Args:
            data: Os dados a serem exibidos.
            columns (list, optional): Os nomes das colunas, se aplicável. Padrão: None.
        """
        # Verifica se é uma lista de linhas e nomes de colunas
        if isinstance(data, list) and columns:
            try:
                df = pd.DataFrame(data, columns=columns)
                st.dataframe(df)
            except Exception as e:
                st.error(f"Erro ao exibir DataFrame: {e}")
        elif isinstance(data, list):
            try:
                for row in data:
                    st.header(row)
            except Exception as e:
                st.error(f"Erro ao exibir lista de dados: {e}")
        elif isinstance(data, pd.DataFrame):
            try:
                st.dataframe(data)
            except Exception as e:
                st.error(f"Erro ao exibir DataFrame: {e}")
        elif isinstance(data, str):
            try:
                st.text_area("Conteúdo:", data, height=300)
            except Exception as e:
                st.error(f"Erro ao exibir texto: {e}")
        elif data is not None and len(data.shape) == 3:  # Verifica se é uma imagem (3 dimensões)
            try:
                st.image(data, caption="Imagem Processada", use_column_width=True)
            except Exception as e:
                st.error(f"Erro ao exibir imagem: {e}")
        elif data is not None:
            try:
                st.write(data)
            except Exception as e:
                st.error(f"Erro ao exibir dados: {e}")
        else:
            st.info("Nada para exibir.")

def main_sql():
    """
    Função para a funcionalidade de consulta SQL.
    """
    c3po = C3PO()
    st.set_page_config(page_title="C3PO - Consulta SQL")
    st.header("C3PO - Executar Consulta SQL")

    prompt = [
        """
        Atue como um especialista em converter perguntas em consulta SQL
        O banco de dados SQL tem o nome EMPLOYEES e tem as seguintes colunas - NAME, EMPLOYEEID,
        AGE e EXPERIENCE. Por exemplo:
        - Exemplo 1: "Quantos registros estão presentes?" resultaria no comando SQL:
          SELECT COUNT(*) FROM EMPLOYEES;
        - Exemplo 2: "Me diga todos os empregados com mais de 2 anos de experiência?" resultaria em:
          SELECT * FROM EMPLOYEES WHERE EXPERIENCE >= 2;
        Além disso, garanta que o código SQL de saída não contenha ``` no início ou no fim, nem a palavra "sql" nele.
        """
    ]

    question = st.text_input("Faça uma pergunta SQL:", key="sql_input")
    submit_sql = st.button("Executar Consulta SQL")

    if submit_sql and question:
        sql_query = c3po.generate_gemini_response(prompt[0], question)
        st.subheader("Consulta SQL Gerada:")
        st.code(sql_query)
        server = "DESKTOP-13019E2\SQLEXPRESS"  # Substitua pelos seus valores
        database = "EMPLOYEES"  # Substitua pelos seus valores
        uid = "sa"  # Substitua pelos seus valores
        pwd = "sua_senha"  # Substitua pelos seus valores # NÃO DEIXE A SENHA NO CÓDIGO
        response, columns = c3po.execute_sql_query(sql_query, server, database, uid, pwd)
        st.subheader("Resposta da Consulta SQL:")
        c3po.display_data(response, columns)

def main_file():
    """
    Função para a funcionalidade de interação com arquivos.
    """
    c3po = C3PO()
    st.set_page_config(page_title="C3PO - Interação com Arquivos")
    st.header("C3PO - Interagir com Arquivos")

    uploaded_file = st.file_uploader("Carregue um arquivo (XLSX, DOCX ou Imagem)",
                                    type=["xlsx", "docx", "jpg", "jpeg", "png"])

    if uploaded_file is not None:
        file_extension = uploaded_file.name.split('.')[-1].lower()

        if file_extension == "xlsx":
            st.subheader("Conteúdo do Arquivo Excel:")
            df = c3po.read_excel_file(uploaded_file)
            c3po.display_data(df)
        elif file_extension == "docx":
            st.subheader("Conteúdo do Documento Word:")
            text = c3po.read_docx_file(uploaded_file)
            c3po.display_data(text)
        elif file_extension in ["jpg", "jpeg", "png"]:
            st.subheader("Imagem Carregada:")
            image = c3po.read_image_file(uploaded_file)
            c3po.display_data(image)

def main_combined():
    """
    Função para a funcionalidade combinada de SQL e arquivos.
    """
    c3po = C3PO()
    st.set_page_config(page_title="C3PO - Operações Combinadas")
    st.header("C3PO - Consulta SQL e Interação com Arquivos")

    prompt = [
        """
        Atue como um especialista em converter perguntas em consulta SQL
        O banco de dados SQL tem o nome EMPLOYEES e tem as seguintes colunas - NAME, EMPLOYEEID,
        AGE e EXPERIENCE. Por exemplo:
        - Exemplo 1: "Quantos registros estão presentes?" resultaria no comando SQL:
          SELECT COUNT(*) FROM EMPLOYEES;
        - Exemplo 2: "Me diga todos os empregados com mais de 2 anos de experiência?" resultaria em:
          SELECT * FROM EMPLOYEES WHERE EXPERIENCE >= 2;
        Além disso, garanta que o código SQL de saída não contenha ``` no início ou no fim, nem a palavra "sql" nele.
        """
    ]

    question = st.text_input("Faça uma pergunta SQL:", key="sql_input")
    submit_sql = st.button("Executar Consulta SQL")

    if submit_sql and question:
        sql_query = c3po.generate_gemini_response(prompt[0], question)
        st.subheader("Consulta SQL Gerada:")
        st.code(sql_query)
        server = "DESKTOP-13019E2\SQLEXPRESS"  # Substitua pelos seus valores
        database = "EMPLOYEES"  # Substitua pelos seus valores
        uid = "sa"  # Substitua pelos seus valores
        pwd = "sua_senha"  # Substitua pelos seus valores # NÃO DEIXE A SENHA NO CÓDIGO
        response, columns = c3po.execute_sql_query(sql_query, server, database, uid, pwd)
        st.subheader("Resposta da Consulta SQL:")
        c3po.display_data(response, columns)

    st.subheader("Interagir com Arquivos:")
    uploaded_file = st.file_uploader("Carregue um arquivo (XLSX, DOCX ou Imagem)",
                                    type=["xlsx", "docx", "jpg", "jpeg", "png"])

    if uploaded_file is not None:
        file_extension = uploaded_file.name.split('.')[-1].lower()

        if file_extension == "xlsx":
            st.subheader("Conteúdo do Arquivo Excel:")
            df = c3po.read_excel_file(uploaded_file)
            c3po.display_data(df)
        elif file_extension == "docx":
            st.subheader("Conteúdo do Documento Word:")
            text = c3po.read_docx_file(uploaded_file)
            c3po.display_data(text)
        elif file_extension in ["jpg", "jpeg", "png"]:
            st.subheader("Imagem Carregada:")
            image = c3po.read_image_file(uploaded_file)
            c3po.display_data(image)

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        mode = sys.argv[1].lower()
        if mode == "sql":
            main_sql()
        elif mode == "file":
            main_file()
        elif mode == "combined":
            main_combined()
        else:
            print("Uso: streamlit run your_script_name.py [sql|file|combined]")
    else:
        main_combined()  # Executa o modo combinado por padrão se nenhum argumento for fornecido
