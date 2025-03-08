from fastapi import APIRouter

from controllers.pedidos_controller import PedidosController # Importando a instância do controller de pedidos

# instancias
pedidos_controller = PedidosController()


# API router
api_router = APIRouter(prefix="/api")

# Incluir as rotas do PedidosController no APIRouter principal (/api)
api_router.include_router(pedidos_controller.router)

# Você pode adicionar outros routers de controllers aqui no futuro (ex: produtos_controller, login_controller, etc.)
# Ex: from controllers.produtos_controller import produtos_controller
# Ex: api_router.include_router(produtos_controller.router)