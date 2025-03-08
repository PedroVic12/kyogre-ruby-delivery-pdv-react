import requests
import json

# Dados do pedido que você quer enviar no POST
dados_pedido = {
    "nome_cliente": "Cliente Teste Python",
    "telefone": "1234567890",
    "endereco": "Rua de Teste, 123",
    "complemento": "Apto 456",
    "forma_pagamento": "Crédito",
    "carrinho": [
        {"quantidade": 2, "nome": "Item 1", "preco": 10.50},
        {"quantidade": 1, "nome": "Item 2", "preco": 25.00}
    ],
    "total_pagar": 56.00 # Total calculado com base nos itens do carrinho
}

# URL da rota POST /api/pedidos/
url_api_pedidos = "http://localhost:8000/api/pedidos/"

try:
    # Enviar requisição POST com os dados em JSON
    response = requests.post(url_api_pedidos, json=dados_pedido)

    # Imprimir o status code da resposta
    print(f"Status Code: {response.status_code}")

    # Se a requisição foi bem-sucedida (status code 2xx)
    if response.status_code // 100 == 2:
        # Imprimir a resposta JSON do servidor
        print("Resposta JSON:")
        print(json.dumps(response.json(), indent=4))
    else:
        # Se houve erro, imprimir o conteúdo da resposta (pode conter mensagem de erro)
        print("Erro na requisição:")
        print(response.text)

except requests.exceptions.RequestException as e:
    print(f"Erro ao conectar com a API: {e}")