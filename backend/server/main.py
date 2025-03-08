from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from controllers.pedidos_controller import pedidos_controller # Importe a INSTÂNCIA exportada!

class RayquazaServer:
    def __init__(self):
        self.app = FastAPI(
            title="Rayquaza PDV API",
            description="API para sistema PDV de restaurantes",
            version="1.0.0"
        )

        # Configurar CORS - ADICIONE AQUI NO ARQUIVO PRINCIPAL
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],  # Em produção, defina origens específicas
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

        # Usar a INSTÂNCIA importada de pedidos_controller
        self.pedidos_controller = pedidos_controller

        # Configurar rotas
        self.setup_routes()

    def setup_routes(self):
        # Criar um APIRouter principal com prefixo /api
        api_router = APIRouter(prefix="/api")

        # Incluir o router de pedidos usando a INSTÂNCIA importada
        api_router.include_router(self.pedidos_controller.router)

        # Incluir o router principal (/api) no app FastAPI
        self.app.include_router(api_router)

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