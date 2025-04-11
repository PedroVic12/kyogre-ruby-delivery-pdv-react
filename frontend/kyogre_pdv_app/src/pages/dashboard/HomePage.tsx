import { Card } from '../../components/ui/Card';
import { OrdersTable } from '../../components/OrdersTable';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

// Definir o tipo esperado pelo OrdersTable
interface OrderPedidos {
  id: number;
  customer: string;
  items: number;
  total: string;
  status: string;
  orderItems: string[];
}

export function HomePage() {
  const [orders, setOrders] = useState<OrderPedidos[]>([]);
  const [loading, setLoading] = useState(true);
  const context = useAuth()
  const token = context.token; // Obter o token do contexto de autenticação

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('https://raichu-server.up.railway.app/api/pedidos/status/finalizados',{
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Inclua o token no header
            'Content-Type': 'application/json', // Boa prática incluir o Content-Type
        },
        });

        // Verificar se a resposta é válida
        if (!response.ok) {
          throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
        }

        // Logar a resposta bruta para depuração
        const textResponse = await response.text();
        //console.log('Resposta bruta da API:', textResponse);

        // Tentar converter para JSON
        const data = JSON.parse(textResponse);

        console.log(data);

        // Transformar os dados no formato esperado
        const transformedOrders = data.supabase_pedidos.map((pedido: any, index: number) => ({
          id: index + 1, // Gerar um ID único (se não houver na API)
          customer: pedido.nome_produto, // Usar `nome_produto` como nome do cliente (ajuste conforme necessário)
          items: 1, // Número de itens (ajuste conforme necessário)
          total: pedido.preco.toFixed(2), // Preço formatado
          status: 'finalizado', // Status fixo (ajuste conforme necessário)
          orderItems: [pedido.nome_produto], // Lista de itens (ajuste conforme necessário)
        }));

        // Atualizar o estado com os pedidos transformados
        console.log(transformedOrders);
        setOrders(transformedOrders);
      } catch (error) {
        console.error('Erro ao buscar os dados do supabase no python:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Carregando pedidos...</div>;
  }
  return (
      <div>

<div className="grid grid-cols-1 pt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card
          title="Produtos Cadastrados"
          value={orders.length.toString()}
          className="w-full"
          color="lightblue"
        />
        <Card 
          title="Pedidos Recebidos hoje"
          value="1"
          className="w-full"
          color="lightblue"
        />
        <Card
          title="Número de clientes ativos"
          value="1"
          className="w-full"
          color="lightblue"
        />
        <Card
          title="Total de vendas"
          value="12"
          className="w-full"
          color="lightblue"
        />
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4 border border-green-500 w-full">
        <OrdersTable orders={orders} />
      </div>
    </div>

      </div>
  );
}