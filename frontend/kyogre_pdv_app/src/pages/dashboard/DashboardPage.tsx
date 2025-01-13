import React from 'react';
import { useOrderStack } from '../../hooks/useOrderStack';
import { OrderColumn } from '../../components/dashboard/OrderColumn';
import { ChevronRight } from 'lucide-react';

export function DashboardPage() {
  const { 
    preparingOrders,
    cookingOrders, 
    completedOrders,
    advanceOrder
  } = useOrderStack();

  return (
    <div className="ml-64 pt-16 p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Gerenciamento de Pedidos</h1>
      
      <div className="grid grid-cols-3 gap-6">
        <OrderColumn
          title="Pedidos sendo Preparados"
          orders={preparingOrders}
          color="bg-red-100"
          count={preparingOrders.length}
          onAdvance={(orderId) => advanceOrder(orderId, 'preparing')}
          buttonIcon={<ChevronRight className="h-5 w-5" />}
        />
        
        <OrderColumn
          title="Pedidos para Entrega"
          orders={cookingOrders}
          color="bg-yellow-100"
          count={cookingOrders.length}
          onAdvance={(orderId) => advanceOrder(orderId, 'cooking')}
          buttonIcon={<ChevronRight className="h-5 w-5" />}
        />
        
        <OrderColumn
          title="Pedidos Finalizados"
          orders={completedOrders}
          color="bg-green-100"
          count={completedOrders.length}
        />
      </div>
    </div>
  );
}