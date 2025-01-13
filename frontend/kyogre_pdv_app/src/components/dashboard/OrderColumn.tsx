import React from 'react';
import { OrderCard } from './OrderCard';
import { Order } from '../../types/order';
import { ReactNode } from 'react';

interface OrderColumnProps {
  title: string;
  orders: Order[];
  color: string;
  count: number;
  onAdvance?: (orderId: number) => void;
  buttonIcon?: ReactNode;
}

export function OrderColumn({ 
  title, 
  orders, 
  color, 
  count, 
  onAdvance,
  buttonIcon 
}: OrderColumnProps) {
  return (
    <div className={`${color} rounded-lg p-4 min-h-[600px]`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{title} - ({count})</h2>
      </div>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard
            key={order.id_pedido}
            order={order}
            onAdvance={onAdvance}
            buttonIcon={buttonIcon}
          />
        ))}
      </div>
    </div>
  );
}