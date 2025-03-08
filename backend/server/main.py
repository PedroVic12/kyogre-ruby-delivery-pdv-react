from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from typing import List
from models.pedido_model import Pedido, PedidoCreate

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

        # Configurar rotas (DIRETAMENTE NO APP, SEM APIRouter para pedidos nesta abordagem)
        self.setup_routes()

    def setup_routes(self):
        app = self.app # Usando 'app' para simplificar os decoradores de rota

        # Rotas de Pedidos - REGISTRADAS DIRETAMENTE NO APP (SEM APIRouter)
        @app.get("/api/pedidos/", response_model=List[Pedido]) # ROTA GET /api/pedidos/ (LISTAR)
        async def listar_pedidos_route(): # Note o sufixo "_route" para evitar conflito de nomes
            return await self.pedidos_controller.listar_pedidos() # Chama o método do controlador

        @app.get("/api/pedidos/{pedido_id}", response_model=Pedido) # ROTA GET /api/pedidos/{pedido_id} (OBTER POR ID)
        async def obter_pedido_route(pedido_id: int): # Note o sufixo "_route"
            return await self.pedidos_controller.obter_pedido(pedido_id) # Chama o método do controlador

        @app.post("/api/pedidos/", response_model=Pedido) # ROTA POST /api/pedidos/ (CRIAR)
        async def criar_pedido_route(pedido: PedidoCreate): # Note o sufixo "_route"
            return await self.pedidos_controller.criar_pedido(pedido) # Chama o método do controlador

        @app.put("/api/pedidos/{pedido_id}", response_model=Pedido) # ROTA PUT /api/pedidos/{pedido_id} (ATUALIZAR)
        async def atualizar_pedido_route(pedido_id: int, pedido_atualizado: PedidoCreate): # Note o sufixo "_route"
            return await self.pedidos_controller.atualizar_pedido(pedido_id, pedido_atualizado) # Chama o método do controlador

        @app.delete("/api/pedidos/{pedido_id}") # ROTA DELETE /api/pedidos/{pedido_id} (DELETAR)
        async def deletar_pedido_route(pedido_id: int): # Note o sufixo "_route"
            return await self.pedidos_controller.deletar_pedido(pedido_id) # Chama o método do controlador


        # Rota de status da API (MANTEMOS COMO ESTAVA)
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