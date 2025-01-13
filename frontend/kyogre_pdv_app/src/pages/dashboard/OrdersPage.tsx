import React from 'react';
import { OrdersTable } from '../../components/OrdersTable';

export function OrdersPage() {
  return (
    <div className="ml-64 pt-16 p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pedidos</h1>
      <OrdersTable />
    </div>
  );
}