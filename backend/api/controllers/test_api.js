import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000'
});



let dados = {
    "nome": "João da Silva",
    "telefone": "11999999999",
    "endereco": "Rua das Flores, 123",
    "produtos": [
        {
            "nome": "Pizza",
            "quantidade": 2,
            "preco": 30.00
        }
    ]
}


const criarPedido = async (dados) => {
  try {
    const response = await api.post('/pedidos', dados);
    return response.data;
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};

export default criarPedido;