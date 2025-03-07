# rayquaza_server.py
from fastapi import FastAPI
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
            allow_origins=["*"],  # Em produção, defina origens específicas
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
        self.pedidos_controller.register_routes(self.app)
        
        #self.login_controller.register_routes(self.app)
        #self.produtos_controller.register_routes(self.app)
        
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