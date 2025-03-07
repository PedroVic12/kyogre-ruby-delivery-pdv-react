from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ItemCarrinho(BaseModel):
    quantidade: int
    nome: str
    preco: float

class DataPedido(BaseModel):
    data: str
    hora: str

class Pedido(BaseModel):
    id: Optional[int] = None
    nome_cliente: str
    telefone: str
    endereco: str
    complemento: str
    forma_pagamento: str
    status: str
    total_pagar: float
    data_pedido: DataPedido
    carrinho: List[ItemCarrinho]

class PedidoCreate(BaseModel):
    nome_cliente: str
    telefone: str
    endereco: str
    complemento: str
    forma_pagamento: str
    status: str = "Em Processo"
    total_pagar: float
    carrinho: List[ItemCarrinho]