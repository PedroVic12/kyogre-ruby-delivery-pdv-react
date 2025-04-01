import { Card } from '../../components/ui/Card';
import { OrdersTable } from '../../components/OrdersTable';

export function HomePage() {
  return (
    <div className="ml-2 pt-8 p-2">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pedidos do seu estabelicimento {Date.now()}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card title="Pedidos Recebidos" value="7" />
        <Card title="Número de clientes ativos" value="3" />
        <Card title="Total de vendas" value="32" />
      </div>
      <OrdersTable />
    </div>
  );
}