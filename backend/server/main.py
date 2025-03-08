from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from routes import api_router  # Importando as rotas de api_routes.py

class RayquazaServer:
    def __init__(self):
        self.app = FastAPI(
            title="Rayquaza PDV API",
            description="API para sistema PDV de restaurantes",
            version="1.1.3"
        )

        origins = [
            "https://ruby-delivery-app.onrender.com",  # Domínio do seu frontend no Render.com (IMPORTANTE: HTTPS!)
            "http://localhost",          # Para testes locais (opcional)
            "http://localhost:5173",     # Para testes locais com Vite dev server (opcional)
        ]

        # Configurar CORS - ADICIONE AQUI NO ARQUIVO PRINCIPAL
        self.app.add_middleware(
            CORSMiddleware,
           # allow_origins=["*"],  # Em produção, defina origens específicas
            allow_origins=origins,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

        # Incluir as rotas da API definidas em routes/api_routes.py
        self.setup_routes()

    def setup_routes(self):
        self.app.include_router(api_router) # Incluindo o api_router importado

        # Rota de status da API (MANTEMOS AQUI - pode ser movida para controllers se desejar)
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