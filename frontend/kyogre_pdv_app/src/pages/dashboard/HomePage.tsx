import { Card } from '../../components/ui/Card';
import { OrdersTable } from '../../components/OrdersTable';
import { useState, useEffect } from 'react';

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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('raichu-server.up.railway.app/api/pedidos/status/finalizados');
        const data = await response.json();

          // Transformar os dados no formato esperado
          const transformedOrders = data.supabase_pedidos.map((pedido: any, index: number) => ({
            id: index + 1, // Gerar um ID único (se não houver na API)
            customer: pedido.nome_produto, // Usar `nome_produto` como nome do cliente (ajuste conforme necessário)
            items: 1, // Número de itens (ajuste conforme necessário)
            total: pedido.preco.toFixed(2), // Preço formatado
            status: 'finalizado', // Status fixo (ajuste conforme necessário)
            orderItems: [pedido.nome_produto], // Lista de itens (ajuste conforme necessário)
  
            
          }));
  

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
    <div className="ml-2 pt-8 p-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card title="Pedidos Recebidos" value={orders.length.toString()} className="w-full md:w-auto" />
        <Card title="Número de clientes ativos" value="1" className="w-full md:w-auto" />
        <Card title="Total de vendas" value="32" className="w-full md:w-auto" />
      </div>
      <OrdersTable orders={orders} />
    </div>
  );
}