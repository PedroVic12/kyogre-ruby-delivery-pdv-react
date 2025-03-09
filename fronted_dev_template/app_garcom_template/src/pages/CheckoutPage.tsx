import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PedidoController from '../controllers/PedidoController';
import TableController from '../controllers/TableController';

const PaymentMethods = [
  { id: 'dinheiro', label: 'DINHEIRO' },
  { id: 'debito', label: 'DÉBITO' },
  { id: 'credito', label: 'CRÉDITO' },
  { id: 'picpay', label: 'PICPAY' }
] as const;

const CheckoutPage = () => {
  const { pedidoId } = useParams();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  
  const pedidoController = PedidoController.getInstance();
  const pedido = pedidoController.getPedido(pedidoId || '');

  useEffect(() => {
    if (pedido) {
      TableController.getInstance().updateTableStatus(pedido.mesa, 'closing');
    }
  }, [pedido]);

  if (!pedido) {
    return <div>Pedido não encontrado</div>;
  }

  const handlePayment = () => {
    if (!selectedMethod) {
      alert('Selecione uma forma de pagamento');
      return;
    }

    pedidoController.updatePaymentMethod(pedido.id, selectedMethod as any);
    TableController.getInstance().updateTableStatus(pedido.mesa, 'free');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Formas de pagamento</h1>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          {PaymentMethods.map((method) => (
            <button
              key={method.id}
              className={`p-4 rounded-lg text-center transition-colors ${
                selectedMethod === method.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              {method.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between text-lg">
            <span>Total</span>
            <span>R$ {pedido.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg">
            <span>Restante</span>
            <span>R$ {pedido.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <button
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
            onClick={handlePayment}
          >
            Finalizar
          </button>
          <button
            className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Finalizar e Imprimir
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage