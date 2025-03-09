import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import PedidoController from '../controllers/PedidoController';
import TableController from '../controllers/TableController';

const MENU_ITEMS = [
  {
    id: 1,
    name: 'Suco de Laranja',
    price: 8.90,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&q=80',
    category: 'sucos'
  },
  {
    id: 2,
    name: 'Suco de Morango',
    price: 9.90,
    image: 'https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=500&q=80',
    category: 'sucos'
  },
  {
    id: 3,
    name: 'Pizza Margherita',
    price: 45.90,
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500&q=80',
    category: 'pizzas'
  },
  {
    id: 4,
    name: 'Pizza Pepperoni',
    price: 49.90,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80',
    category: 'pizzas'
  },
  {
    id: 5,
    name: 'Hambúrguer Clássico',
    price: 32.90,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80',
    category: 'hamburguers'
  },
  {
    id: 6,
    name: 'Hambúrguer Duplo',
    price: 39.90,
    image: 'https://images.unsplash.com/photo-1586816001966-79b736744398?w=500&q=80',
    category: 'hamburguers'
  }
];

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const CardapioPDV = () => {
  const { mesa } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'sucos' | 'pizzas' | 'hamburguers'>('sucos');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customersCount, setCustomersCount] = useState(1);

  useEffect(() => {
    if (mesa) {
      TableController.getInstance().updateTableStatus(Number(mesa), 'occupied', customersCount);
    }
  }, [mesa, customersCount]);

  const handleFinishOrder = () => {
    if (!customerName) {
      alert('Por favor, insira o nome do cliente');
      return;
    }

    const pedidoController = PedidoController.getInstance();
    const newPedido = pedidoController.createPedido({
      mesa: Number(mesa),
      cliente: customerName,
      items: cart,
      total: calculateTotal()
    });

    navigate(`/checkout/${newPedido.id}`);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const addToCart = (item: typeof MENU_ITEMS[0]) => {
    setCart(current => {
      const existing = current.find(i => i.id === item.id);
      if (existing) {
        return current.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...current, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart(current => {
      const existing = current.find(i => i.id === itemId);
      if (existing && existing.quantity > 1) {
        return current.map(i =>
          i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      return current.filter(i => i.id !== itemId);
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Cart Section */}
      <div className="w-1/3 bg-white p-4 shadow-lg">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome do Cliente
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Nome do cliente"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de Pessoas
          </label>
          <input
            type="number"
            min="1"
            value={customersCount}
            onChange={(e) => setCustomersCount(Number(e.target.value))}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <h2 className="text-lg font-semibold mb-4">Pedido</h2>
        <div className="space-y-4 mb-4">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">R$ {item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                >
                  <Minus size={16} />
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => addToCart(MENU_ITEMS.find(i => i.id === item.id)!)}
                  className="p-1 text-green-500 hover:bg-green-50 rounded"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t pt-4">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>R$ {calculateTotal().toFixed(2)}</span>
          </div>
          <button
            onClick={handleFinishOrder}
            disabled={cart.length === 0 || !customerName}
            className="w-full mt-4 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
          >
            Finalizar Pedido
          </button>
        </div>
      </div>

      {/* Menu Section */}
      <div className="flex-1 p-4">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('sucos')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'sucos' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            Sucos
          </button>
          <button
            onClick={() => setActiveTab('pizzas')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'pizzas' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            Pizzas
          </button>
          <button
            onClick={() => setActiveTab('hamburguers')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'hamburguers' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            Hambúrgueres
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {MENU_ITEMS.filter(item => item.category === activeTab).map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">R$ {item.price.toFixed(2)}</p>
                <button
                  onClick={() => addToCart(item)}
                  className="mt-2 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                  Adicionar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardapioPDV