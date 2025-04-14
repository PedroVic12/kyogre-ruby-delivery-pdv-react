import { useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Registrar os componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface Order {
  id: number;
  customer: string;
  items: number;
  total: string;
  status: string;
  orderItems: string[];
}


function OrderRow({ order }: { order: Order }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <tr>
        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{order.items}</td>
        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{order.total}</td>
        {/* <td className="px-4 py-2 whitespace-nowrap">
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              order.status === 'Pendente'
                ? 'bg-yellow-100 text-yellow-800'
                : order.status === 'Em preparo'
                ? 'bg-blue-100 text-blue-800'
                : order.status === 'Em entrega'
                ? 'bg-orange-100 text-orange-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {order.status}
          </span>
        </td>
        <td className="px-4 py-2 whitespace-nowrap">
          <button onClick={() => setIsOpen(!isOpen)} className="text-blue-500 hover:underline">
            {isOpen ? 'Ocultar Itens' : 'Ver Itens'}
          </button>
        </td> */}
      </tr>
      {/* {isOpen && (
        <tr>
          <td colSpan={6} className="px-4 py-2">
            <ul className="list-disc pl-5">
              {order.orderItems.map((item, index) => (
                <li key={index} className="text-sm text-gray-700">
                  {item}
                </li>
              ))}
            </ul>
          </td>
        </tr>
      )} */}
    </>
  );
}

interface OrdersTableProps {
  orders: Order[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  if (orders.length === 0) {
    return <div className="text-center py-10">Nenhum pedido encontrado.</div>;
  }


  // Obter a data atual no formato dia/mês/ano
  const today = new Date();
  const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${today.getFullYear()}`;



  //! Dados para o gráfico de barras (Pedidos durante o dia)
  const barData = {
    labels: ['7h', '9h', '11h', '13h', '15h', '17h', '19h', '21h', '23h'],
    datasets: [
      {
        label: 'Pedidos',
        data: [5, 8, 25, 30, 15, 30, 55, 90, 25], // Substitua pelos dados reais
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  //! Dados para o gráfico de pizza (Categorias mais vendidas)
  const pieData = {
    labels: ['Bebidas', 'Lanches', 'Pratos principais', 'Sobremesas'],
    datasets: [
      {
        label: 'Categorias',
        data: [30, 50, 70, 20], // Substitua pelos dados reais
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverOffset: 4,
      },
    ],
  };
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Produtos Cadastrados</h2>
        <p className="text-sm text-gray-500">Hoje: {formattedDate}</p>
      </div>
      <div className="overflow-x-auto">
        <div className="table-container">
          <table className="w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Protudos</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>

                {/* <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th> */}
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

      {/* Gráficos */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pedidos Durante o Dia</h3>
        <div className="w-full max-w-2xl mx-auto">
          <Bar data={barData} />
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Categorias Mais Vendidas</h3>
        <div className="w-full max-w-md mx-auto">
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  );
}