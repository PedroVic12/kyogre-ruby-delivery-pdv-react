import { MenuCategory } from '../../components/menu/MenuCategory';
import { AddProductModal } from '../../components/menu/AddProductModal';
import { useMenuState } from '../../hooks/useMenuState';
import { useState } from 'react';


function TestePedidoButton() {
  const [mensagem, setMensagem] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fazerPedido = async () => {
    setIsLoading(true);
    setMensagem('Enviando pedido...');

    const pedidoData = {
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
    };

    try {
      const resposta = await fetch('http://localhost:8000/api/pedidos/', { // Use 'http://localhost:8000/api/pedidos/' para teste local
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedidoData),
      });

      if (resposta.ok) {
        const data = await resposta.json();
        setMensagem(`Pedido criado com sucesso! Resposta da API: ${JSON.stringify(data)}`);
      } else {
        const erroTexto = await resposta.text();
        setMensagem(`Erro ao criar pedido. Status: ${resposta.status}. Detalhes: ${erroTexto}`);
      }
    } catch (error) {
      setMensagem(`Erro ao enviar requisição: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={fazerPedido} disabled={isLoading}>
        {isLoading ? 'Enviando...' : 'Fazer Pedido de Teste (POST)'}
      </button>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}

export function MenuPage() {
  const {
    categories,
    isModalOpen,
    setIsModalOpen,
    handleAddProduct,
    handleDeleteProduct
  } = useMenuState();

  return (
    <div className="ml-2 pt-8 p-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gerenciar Cardápio</h1>

        <TestePedidoButton />
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Adicionar Produto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <MenuCategory
            key={category.id}
            category={category}
            onDeleteProduct={handleDeleteProduct}
          />
        ))}
      </div>

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddProduct}
      />
    </div>
  );
}