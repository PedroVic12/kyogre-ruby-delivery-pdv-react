from pydantic import BaseModel

class Usuario:
    def __init__(self, nome: str, email: str, senha: str, last_login: str, id: int):
        self.nome = nome
        self.email = email
        self.senha = senha
        self.last_login = last_login
        self.id = id

class UsuarioCreate(BaseModel):
    nome: str
    email: str
    senha: str

class UsuarioLogin(BaseModel):
    email: str
    senha: str

class Token(BaseModel):
    access_token: str
    token_type: str