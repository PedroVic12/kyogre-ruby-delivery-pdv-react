import { useState, useEffect } from 'react';
import { Order } from '../types/order';

export function useOrderStack() {
  const [preparingOrders, setPreparingOrders] = useState<Order[]>([]);
  const [cookingOrders, setCookingOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);

  // Simulating receiving a new order
  useEffect(() => {
    const mockOrder: Order = {
      id_pedido: 1,
      data: "2021-07-23T18:00:00.000Z",
      nome: "João",
      telefone: "999999999",
      endereco: "Rua 1",
      complemento: "Casa",
      formaPagamento: "Dinheiro",
      status: "preparo",
      pedido: [
        { quantidade: 1, nome: "X-Bacon", preco: 15.0 },
        { quantidade: 1, nome: "X-Salada", preco: 12.0 },
      ],
      totalPagar: 27.0,
    };

    setPreparingOrders([mockOrder]);
  }, []);

  const advanceOrder = (orderId: number, currentStatus: 'preparing' | 'cooking') => {
    if (currentStatus === 'preparing') {
      const order = preparingOrders.find(o => o.id_pedido === orderId);
      if (order) {
        setPreparingOrders(prev => prev.filter(o => o.id_pedido !== orderId));
        setCookingOrders(prev => [...prev, { ...order, status: 'cozinha' }]);
      }
    } else if (currentStatus === 'cooking') {
      const order = cookingOrders.find(o => o.id_pedido === orderId);
      if (order) {
        setCookingOrders(prev => prev.filter(o => o.id_pedido !== orderId));
        setCompletedOrders(prev => [...prev, { ...order, status: 'finalizado' }]);
      }
    }
  };

  return {
    preparingOrders,
    cookingOrders,
    completedOrders,
    advanceOrder,
  };
}