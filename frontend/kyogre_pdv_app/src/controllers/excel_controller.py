import pandas as pd
import sqlite3
from typing import List, Dict
import bcrypt

#pip install pandas sqlite3 bcrypt openpyxl --break-system-packages 

class ExcelToSQLiteConverter:
    def __init__(self, db_path: str = '../database/database.sqlite'):
        self.db_path = db_path
        self.conn = None
        self.cursor = None

    def connect(self):
        """Conecta ao banco SQLite"""
        self.conn = sqlite3.connect(self.db_path)
        self.cursor = self.conn.cursor()

    def close(self):
        """Fecha a conexão"""
        if self.conn:
            self.conn.close()

    def create_tables(self):
        """Cria a tabela de usuários se não existir"""
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                role TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                senha TEXT NOT NULL,
                table_name TEXT,
                storage TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        self.conn.commit()

    def excel_to_df(self, excel_path: str) -> pd.DataFrame:
        """Converte Excel para DataFrame"""
        return pd.read_excel(excel_path)

    def hash_password(self, password: str) -> str:
        """Hash a senha usando bcrypt"""
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

    def df_to_sqlite(self, df: pd.DataFrame):
        """Converte DataFrame para SQLite"""
        for _, row in df.iterrows():
            senha_hash = self.hash_password(str(row['senha']))
            
            self.cursor.execute('''
                INSERT OR REPLACE INTO usuarios (role, email, senha, table_name, storage)
                VALUES (?, ?, ?, ?, ?)
            ''', (
                row['role'],
                row['email'],
                senha_hash,
                row.get('table', None),
                row.get('storage', None)
            ))
        
        self.conn.commit()

    def process_excel(self, excel_path: str):
        """Processa o arquivo Excel e converte para SQLite"""
        try:
            self.connect()
            self.create_tables()
            
            df = self.excel_to_df(excel_path)
            self.df_to_sqlite(df)
            
            print("Dados convertidos com sucesso!")
        except Exception as e:
            print(f"Erro ao processar: {str(e)}")
        finally:
            self.close()

# Uso direto com lista de usuários
def users_to_sqlite(usuarios: List[Dict]):
    converter = ExcelToSQLiteConverter()
    
    try:
        converter.connect()
        converter.create_tables()
        
        df = pd.DataFrame(usuarios)
        converter.df_to_sqlite(df)
        
        print("Usuários importados com sucesso!")
    except Exception as e:
        print(f"Erro ao importar usuários: {str(e)}")
    finally:
        converter.close()

# Exemplo de uso
if __name__ == "__main__":
    USUARIOS = [
        {
            "nome": "admin",
            "email": "admin@admin",
            "senha": "admin",
            "table": "cardapio",
            "storage": "cardapio_fotos"
        },
        {
            "nome": "Pedro Victor - The Creator",
            "email": "pedrovictor.rveras12@gmail.com",
            "senha": "pedro",
            "table": "cardapio",
            "storage": "cardapio_fotos"
        },
        {
            "nome": "cliente1",
            "email": "gabyltds@icloud.com",
            "senha": ""
        }
    ]
    
    users_to_sqlite(USUARIOS)