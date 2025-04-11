import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PedidoController, {PedidoMesa} from '../controllers/PedidoController';
import TableController from '../controllers/TableController';
import { useAuth } from '../../../src/contexts/AuthContext';


const PaymentMethods = [
  { id: 'dinheiro', label: 'DINHEIRO' },
  { id: 'debito', label: 'DÉBITO' },
  { id: 'credito', label: 'CRÉDITO' },
  { id: 'pix', label: 'PIX' }
] as const;

const CheckoutPage = () => {
  const { pedidoId } = useParams<{ pedidoId: string }>();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const {token} = useAuth()

  const pedidoController = PedidoController.getInstance();
  // Ensure pedidoId is a number when fetching the pedido
  const pedido = pedidoController.getPedido(pedidoId ? parseInt(pedidoId, 10) : NaN);

  useEffect(() => {
    if (pedido) {
      TableController.getInstance().updateTableStatus(pedido.id, 'finalizando');
    }
  }, [pedido]);

  if (!pedido) {
    return <div>Pedido não encontrado</div>;
  }


  const handleFinalizarImprimir = () => {
    if (pedido) {
      TableController.getInstance().updateTableStatus(pedido.id, 'livre');
      alert("Gerando arquivo pdf...")
      
      navigate('/pedido_pdf' );
    }
  };

  const EnviarPedido = () => {

    if (!selectedMethod) {
      alert('Selecione uma forma de pagamento');
      return;
    }

    if (pedido && selectedMethod) {
      const pedidoToSend = { ...pedido, forma_pagamento: selectedMethod as PedidoMesa['forma_pagamento'] };
      console.log("Enviando pedido pelo PDV...")
      console.log(pedido)

      if (!token){
        alert('Token não encontrado');
        return;
      }

      pedidoController.fazerPedido(pedidoToSend,token);
      pedidoController.updatePaymentMethod(pedido.id, selectedMethod as never);
      TableController.getInstance().updateTableStatus(pedido.id, 'livre');

      //alert('Pedido enviado!');
      navigate('/');

    } else {
      alert('Selecione a forma de pagamento antes de enviar o pedido.');
    }

 
  };

  return (
    <div className="max-w-screen-md mx-auto min-h-screen bg-gray-400 p-4 flex items-center justify-center">
      <div className="max-w-screen-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Formas de pagamento</h1>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {PaymentMethods.map((method) => (
            <button
              key={method.id}
              className={`p-4 rounded-lg text-center transition-colors ${selectedMethod === method.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-300'
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
            <span>R$ {pedido.total_pagar.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg">
            <span>Restante</span>
            <span>R$ {pedido.total_pagar.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <button
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
            onClick={EnviarPedido}
          >
            Finalizar
          </button>
          <button
            className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            onClick={handleFinalizarImprimir}
          >
            Finalizar e Imprimir
          </button>
 
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;