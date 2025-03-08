import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000'
});



let dados = {
  "id": 1861,
  "nome_cliente": "Pv",
  "telefone": "5521999289987",
  "endereco": "Niterói",
  "complemento": "Sem Complemento.",
  "forma_pagamento": "Dinheiro",
  "status": "Em Processo",
  "total_pagar": 96,
  "data_pedido": {
    "data": "06/03/2025",
    "hora": " 03:08:19"
  },
  "carrinho": [
    {
      "quantidade": 1,
      "nome": "Americano",
      "preco": 24
    },
    {
      "quantidade": 1,
      "nome": "Bauru",
      "preco": 42
    },
    {
      "quantidade": 1,
      "nome": "Filé de Carne",
      "preco": 30
    }
  ]
}

const criarPedido = async (dados) => {
  try {
    const response = await api.post('/api/pedidos', dados);
    return response.data;
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};

//criarPedido(dados);


export default criarPedido;