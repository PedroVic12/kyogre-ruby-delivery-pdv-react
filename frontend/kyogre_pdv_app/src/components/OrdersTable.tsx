import  { useState } from 'react';

// Definindo a interface para o pedido
interface Order {
  id: number;
  customer: string;
  items: number;
  total: string;
  status: string;
  orderItems: string[];
}

const orders: Order[] = [
  { id: 1, customer: 'João Silva', items: 3, total: 'R$ 89,90', status: 'Pendente', orderItems: ['Café', 'Pão', 'Suco'] },
  { id: 2, customer: 'Maria Santos', items: 2, total: 'R$ 45,80', status: 'Em preparo', orderItems: ['Misto', 'Suco'] },
  { id: 3, customer: 'Anakin Skywalker', items: 4, total: 'R$ 112,50', status: 'Em entrega', orderItems: ['Pizza', 'Hamburguer', 'Suco'] },
  { id: 4, customer: 'Pedro Victor', items: 1, total: 'R$ 25,00', status: 'Entregue', orderItems: ['Café'] },
];

function OrderRow({ order }: { order: Order }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.items}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.total}</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">{order.status}</span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <button onClick={() => setIsOpen(!isOpen)} className="text-blue-500 hover:underline">
            {isOpen ? 'Ocultar Itens' : 'Ver Itens'}
          </button>
        </td>
      </tr>
      {isOpen && (
        <tr>
          <td colSpan={6} className="px-6 py-4">
            <ul>
              {order.orderItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </td>
        </tr>
      )}
    </>
  );
}

export function OrdersTable() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Pedidos Recentes</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pedido</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Itens</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}