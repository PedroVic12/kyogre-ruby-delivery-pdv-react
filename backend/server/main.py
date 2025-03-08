# rayquaza_server.py
from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from controllers.pedidos_controller import PedidosController
#from controllers.login_controller import LoginController
#from controllers.produtos_controller import ProdutosController

class RayquazaServer:
    def __init__(self):
        self.app = FastAPI(
            title="Rayquaza PDV API",
            description="API para sistema PDV de restaurantes",
            version="1.0.0"
        )
        
        # Configurar CORS
        self.app.add_middleware(
            CORSMiddleware,
            #allow_origins=["*"],  # Em produção, defina origens específicas
            allow_origins=["https://ruby-delivery-app.onrender.com", "http://localhost:5173"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
        
        # Instanciar controladores
        self.pedidos_controller = PedidosController()
        
        #! Falta ainda implementar os controllers de login e produtos_cardapio
        #self.login_controller = LoginController()
        #self.produtos_controller = ProdutosController()
        
        # Configurar rotas
        self.setup_routes()
    
    def setup_routes(self):
        # Rotas de Pedidos
        # Não precisamos mais registrar as rotas diretamente, vamos usar um Router principal

        # Criar um APIRouter principal com prefixo /api
        api_router = APIRouter(prefix="/api")

        # Registrar o router de pedidos DENTRO do router principal /api
        api_router.include_router(self.pedidos_controller.router)

        # Incluir o router principal (/api) no app FastAPI
        self.app.include_router(api_router)

        # ... outras rotas (se tiverem um prefixo diferente, como /auth, etc., seguiriam o mesmo padrão)
        # Ex:
        # auth_router = APIRouter(prefix="/auth")
        # auth_router.include_router(self.login_controller.router)
        # api_router.include_router(auth_router) # Incluir rotas de auth DENTRO de /api TAMBÉM se desejado
        # self.app.include_router(api_router) # Incluímos apenas api_router no app principal neste exemplo

            
        # Rota de status da API
        @self.app.get("/")
        async def root():
            return {"status": "online", "message": "Rayquaza PDV API está funcionando!"}
    
    def run(self, host="0.0.0.0", port=8000, reload=True):
        uvicorn.run(self.app, host=host, port=port, reload=reload)

# Criar instância do servidor
server = RayquazaServer()

# Expor a aplicação FastAPI para o Uvicorn
app = server.app

# Para ser chamado pelo uvicorn
if __name__ == "__main__":
    server.run(reload=True)