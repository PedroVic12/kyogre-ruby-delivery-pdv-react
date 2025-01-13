import { Order } from '../../types/order';
import { ReactNode } from 'react';

interface OrderCardProps {
  order: Order;
  onAdvance?: (orderId: number) => void;
  buttonIcon?: ReactNode;
}

export function OrderCard({ order, onAdvance, buttonIcon }: OrderCardProps) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold">Pedido #{order.id_pedido}</h3>
          <p className="text-sm text-gray-600">{order.nome}</p>
        </div>
        {onAdvance && buttonIcon && (
          <button
            onClick={() => onAdvance(order.id_pedido)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            {buttonIcon}
          </button>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="text-sm">
          <p className="text-gray-600">Endereço: {order.endereco}</p>
          <p className="text-gray-600">Complemento: {order.complemento}</p>
        </div>
        
        <div className="border-t pt-2">
          <p className="text-sm font-medium">Itens do pedido:</p>
          {order.pedido.map((item, index) => (
            <div key={index} className="text-sm text-gray-600 flex justify-between">
              <span>{item.quantidade}x {item.nome}</span>
              <span>R$ {item.preco.toFixed(2)}</span>
            </div>
          ))}
        </div>
        
        <div className="border-t pt-2 flex justify-between items-center">
          <span className="text-sm text-gray-600">Pagamento: {order.formaPagamento}</span>
          <span className="font-semibold">Total: R$ {order.totalPagar.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}