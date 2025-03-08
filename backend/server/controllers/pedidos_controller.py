from fastapi import HTTPException
from typing import List
from datetime import datetime
import json
import os
from models.pedido_model import Pedido, PedidoCreate

class PedidosController:
    def __init__(self):
        self.database_file = "pedidos.json"

    def load_pedidos(self):
        if os.path.exists(self.database_file):
            with open(self.database_file, 'r') as f:
                return json.load(f)
        return []

    def save_pedidos(self, pedidos):
        with open(self.database_file, 'w') as f:
            json.dump(pedidos, f, indent=4)

    async def listar_pedidos(self) -> List[Pedido]:  # Note que virou método da classe
        return self.load_pedidos()

    async def obter_pedido(self, pedido_id: int) -> Pedido: # Note que virou método da classe
        pedidos = self.load_pedidos()
        for pedido in pedidos:
            if pedido["id"] == pedido_id:
                return pedido
        raise HTTPException(status_code=404, detail="Pedido não encontrado")

    async def criar_pedido(self, pedido: PedidoCreate) -> Pedido: # Note que virou método da classe
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

    async def atualizar_pedido(self, pedido_id: int, pedido_atualizado: PedidoCreate) -> Pedido: # Note que virou método da classe
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

    async def deletar_pedido(self, pedido_id: int) -> dict: # Note que virou método da classe
        pedidos = self.load_pedidos()
        for i, pedido in enumerate(pedidos):
            if pedido["id"] == pedido_id:
                del pedidos[i]
                self.save_pedidos(pedidos)
                return {"message": "Pedido deletado com sucesso"}
        raise HTTPException(status_code=404, detail="Pedido não encontrado")


# Exportando a instancia do controller para ser usado no rayquaza_server.py
pedidos_controller = PedidosController()