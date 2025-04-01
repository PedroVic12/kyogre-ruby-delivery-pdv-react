import { Card } from '../../components/ui/Card';
import { OrdersTable } from '../../components/OrdersTable';

export function HomePage() {
  return (
    <div className="ml-2 pt-8 p-2">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card title="Pedidos Recebidos" value="7" className="w-full md:w-auto" />
        <Card title="Número de clientes ativos" value="3" className="w-full md:w-auto" />
        <Card title="Total de vendas" value="32" className="w-full md:w-auto" />
      </div>
      <OrdersTable />
    </div>
  );
}