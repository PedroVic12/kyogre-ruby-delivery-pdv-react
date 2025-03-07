from fastapi import FastAPI, HTTPException
from typing import List
from datetime import datetime
from models.pedido_model import Pedido, PedidoCreate
import json
import os

app = FastAPI()

# Simular um banco de dados com um arquivo JSON
DATABASE_FILE = "pedidos.json"

def load_pedidos():
    if os.path.exists(DATABASE_FILE):
        with open(DATABASE_FILE, 'r') as f:
            return json.load(f)
    return []

def save_pedidos(pedidos):
    with open(DATABASE_FILE, 'w') as f:
        json.dump(pedidos, f, indent=4)

@app.get("/pedidos/", response_model=List[Pedido])
async def listar_pedidos():
    return load_pedidos()

@app.get("/pedidos/{pedido_id}", response_model=Pedido)
async def obter_pedido(pedido_id: int):
    pedidos = load_pedidos()
    for pedido in pedidos:
        if pedido["id"] == pedido_id:
            return pedido
    raise HTTPException(status_code=404, detail="Pedido não encontrado")

@app.post("/pedidos/", response_model=Pedido)
async def criar_pedido(pedido: PedidoCreate):
    pedidos = load_pedidos()
    
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
        "data_pedido": data_pedido
    }
    
    pedidos.append(novo_pedido)
    save_pedidos(pedidos)
    return novo_pedido

@app.put("/pedidos/{pedido_id}", response_model=Pedido)
async def atualizar_pedido(pedido_id: int, pedido_atualizado: PedidoCreate):
    pedidos = load_pedidos()
    for i, pedido in enumerate(pedidos):
        if pedido["id"] == pedido_id:
            pedidos[i] = {
                "id": pedido_id,
                **pedido_atualizado.dict(),
                "data_pedido": pedido["data_pedido"]
            }
            save_pedidos(pedidos)
            return pedidos[i]
    raise HTTPException(status_code=404, detail="Pedido não encontrado")

@app.delete("/pedidos/{pedido_id}")
async def deletar_pedido(pedido_id: int):
    pedidos = load_pedidos()
    for i, pedido in enumerate(pedidos):
        if pedido["id"] == pedido_id:
            del pedidos[i]
            save_pedidos(pedidos)
            return {"message": "Pedido deletado com sucesso"}
    raise HTTPException(status_code=404, detail="Pedido não encontrado")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)