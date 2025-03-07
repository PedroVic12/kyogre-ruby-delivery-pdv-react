# controllers/login_controller.py
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Optional
from datetime import datetime, timedelta
import json
import os
import jwt
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from models.usuario_model import Usuario, UsuarioCreate, UsuarioLogin, Token


# Configurações de segurança
SECRET_KEY = "sua_chave_secreta_aqui"  # Em produção, use variáveis de ambiente
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# OAuth2 para autenticação
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login/token")

class LoginController:
    def __init__(self):
        self.router = APIRouter(prefix="/login", tags=["autenticação"])
        self.database_file = "usuarios.json"
    
    def register_routes(self, app):
        # Rota para login e obtenção de token
        @self.router.post("/token", response_model=Token)
        async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
            usuario = self.authenticate_user(form_data.username, form_data.password)
            if not usuario:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Email ou senha incorretos",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            
            # Registrar data e hora do login
            self.update_last_login(usuario["email"])
            
            # Enviar email de notificação
            self.send_login_notification(usuario["email"])
            
            # Criar token de acesso
            access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = self.create_access_token(
                data={"sub": usuario["email"]}, expires_delta=access_token_expires
            )
            
            return {"access_token": access_token, "token_type": "bearer"}
        
        # Rota para registro de novo usuário
        @self.router.post("/register", response_model=Usuario)
        async def register_user(usuario: UsuarioCreate):
            usuarios = self.load_usuarios()
            
            # Verificar se o email já existe
            for user in usuarios:
                if user["email"] == usuario.email:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Email já cadastrado"
                    )
            
            # Criar novo usuário
            novo_usuario = {
                "nome": usuario.nome,
                "email": usuario.email,
                "senha": usuario.senha,  # Em produção, use hash
                "last_login": datetime.now().isoformat()
            }
            
            usuarios.append(novo_usuario)
            self.save_usuarios(usuarios)
            
            # Remover senha do retorno
            usuario_retorno = novo_usuario.copy()
            usuario_retorno.pop("senha")
            
            return usuario_retorno
        
        # Rota para obter informações do usuário atual
        @self.router.get("/me", response_model=Usuario)
        async def get_current_user_info(current_user: Usuario = Depends(self.get_current_user)):
            return current_user
        
        # Adicionar as rotas ao app
        app.include_router(self.router)
    
    def authenticate_user(self, email: str, senha: str):
        usuarios = self.load_usuarios()
        for usuario in usuarios:
            if usuario["email"] == email and usuario["senha"] == senha:  # Em produção, compare hashes
                return usuario
        return None
    
    def update_last_login(self, email: str):
        usuarios = self.load_usuarios()
        for i, usuario in enumerate(usuarios):
            if usuario["email"] == email:
                usuarios[i]["last_login"] = datetime.now().isoformat()
                self.save_usuarios(usuarios)
                break
    
    def send_login_notification(self, email: str):
        # Configurações de email - em produção, use variáveis de ambiente
        smtp_server = "smtp.gmail.com"
        smtp_port = 587
        sender_email = "seu_email@gmail.com"
        sender_password = "sua_senha_app"
        owner_email = "email_do_dono@gmail.com"
        
        try:
            # Criar mensagem
            message = MIMEMultipart()
            message["From"] = sender_email
            message["To"] = owner_email
            message["Subject"] = "Nova Autenticação - Rayquaza PDV"
            
            current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            body = f"""
            <html>
                <body>
                    <h2>Rayquaza PDV - Notificação de Login</h2>
                    <p>Um novo login foi detectado no sistema:</p>
                    <ul>
                        <li><strong>Usuário:</strong> {email}</li>
                        <li><strong>Data/Hora:</strong> {current_time}</li>
                    </ul>
                    <p>Se você não realizou este login, verifique a segurança da sua conta.</p>
                </body>
            </html>
            """
            
            message.attach(MIMEText(body, "html"))
            
            # Conectar ao servidor SMTP
            server = smtplib.SMTP(smtp_server, smtp_port)
            server.starttls()
            server.login(sender_email, sender_password)
            
            # Enviar email
            server.send_message(message)
            server.quit()
            
        except Exception as e:
            print(f"Erro ao enviar email: {e}")
    
    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None):
        to_encode = data.copy()
        
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=15)
            
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    @staticmethod
    async def get_current_user(token: str = Depends(oauth2_scheme)):
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Não foi possível validar as credenciais",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
        try:
            # Decodificar o token
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            email: str = payload.get("sub")
            if email is None:
                raise credentials_exception
        except jwt.PyJWTError:
            raise credentials_exception
        
        # Carregar e retornar o usuário
        controller = LoginController()
        usuarios = controller.load_usuarios()
        for usuario in usuarios:
            if usuario["email"] == email:
                # Remover senha do retorno
                usuario_retorno = usuario.copy()
                if "senha" in usuario_retorno:
                    usuario_retorno.pop("senha")
                return usuario_retorno
                
        raise credentials_exception
    
    def load_usuarios(self):
        if os.path.exists(self.database_file):
            with open(self.database_file, 'r') as f:
                return json.load(f)