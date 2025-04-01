import { useState, useEffect } from 'react';
import { OrdersTable } from '../../components/OrdersTable';


// Definindo a interface para o pedido
interface Order {
  id: number;
  customer: string;
  items: number;
  total: string;
  status: string;
  orderItems: string[];
}

export function OrdersPage() {

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulando uma chamada para API
    const fetchOrders = async () => {
      try {
        const response = await fetch('https://api.exemplo.com/orders'); // Substitua pela URL da sua API
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Obter a data atual no formato dia/mês/ano
  const today = new Date();
  const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${today.getFullYear()}`;

  if (loading) {
    return <div className="text-center py-10">Carregando pedidos...</div>;
  }


    
  //tenho que passar o orders para o OrdersTable


  return (
    <div className="ml-64 pt-16 p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pedidos de hoje - {formattedDate} </h1>
      <OrdersTable />
    </div>
  );
}