from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime
import json
import os
from models.pedido_model import Pedido, PedidoCreate

class PedidosController:
    def __init__(self):
        self.router = APIRouter(prefix="/pedidos", tags=["pedidos"])
        self.database_file = "pedidos.json"
        self.setup_routes() # Chamando setup_routes no __init__ para registrar as rotas

    def setup_routes(self):
        router = self.router # Usando 'router' para simplificar o código dentro de setup_routes

        # Listar todos os pedidos
        @router.get("/", response_model=List[Pedido])
        async def listar_pedidos():
            return self.load_pedidos()

        # Obter um pedido específico
        @router.get("/{pedido_id}", response_model=Pedido)
        async def obter_pedido(pedido_id: int):
            pedidos = self.load_pedidos()
            for pedido in pedidos:
                if pedido["id"] == pedido_id:
                    return pedido
            raise HTTPException(status_code=404, detail="Pedido não encontrado")

        # Criar um novo pedido
        @router.post("/", response_model=Pedido)
        async def criar_pedido(pedido: PedidoCreate):
            pedidos = self.load_pedidos()

            # Gerar ID único
            novo_id = max([p["id"] for p in pedidos], default=0) + 1

            # Criar data e hora atual
            agora = datetime.now()
            data_pedido = {
                "data": agora.strftime("%d/%m/%Y"),
                "hora": agora.strftime(" %H:%M:%S")
            }

            novo_pedido = {
                "id": novo_id,
                **pedido.dict(),
                "data_pedido": data_pedido,
                "status": "Em Processo" # Adicionando status padrão ao criar pedido
            }

            pedidos.append(novo_pedido)
            self.save_pedidos(pedidos)
            return novo_pedido

        # Atualizar um pedido existente
        @router.put("/{pedido_id}", response_model=Pedido)
        async def atualizar_pedido(pedido_id: int, pedido_atualizado: PedidoCreate):
            pedidos = self.load_pedidos()
            for i, pedido in enumerate(pedidos):
                if pedido["id"] == pedido_id:
                    pedidos[i] = {
                        "id": pedido_id,
                        **pedido_atualizado.dict(),
                        "data_pedido": pedido["data_pedido"],
                        "status": pedido["status"] # Preservando o status existente
                    }
                    self.save_pedidos(pedidos)
                    return pedidos[i]
            raise HTTPException(status_code=404, detail="Pedido não encontrado")

        # Deletar um pedido
        @router.delete("/{pedido_id}")
        async def deletar_pedido(pedido_id: int):
            pedidos = self.load_pedidos()
            for i, pedido in enumerate(pedidos):
                if pedido["id"] == pedido_id:
                    del pedidos[i]
                    self.save_pedidos(pedidos)
                    return {"message": "Pedido deletado com sucesso"}
            raise HTTPException(status_code=404, detail="Pedido não encontrado")


    def load_pedidos(self):
        if os.path.exists(self.database_file):
            with open(self.database_file, 'r') as f:
                return json.load(f)
        return []

    def save_pedidos(self, pedidos):
        with open(self.database_file, 'w') as f:
            json.dump(pedidos, f, indent=4)
