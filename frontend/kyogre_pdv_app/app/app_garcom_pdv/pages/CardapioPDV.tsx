import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Minus, NavigationIcon } from 'lucide-react';
import PedidoController from '../controllers/PedidoController';
import TableController from '../controllers/TableController';
import { Fab, Dialog, DialogTitle, DialogContent, TextField, Button, Tabs, Tab, AppBar, Toolbar, Typography } from '@mui/material';

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
  },
  // Add more items here
  {
    id: 7,
    name: 'Refrigerante Cola',
    price: 7.00,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80',
    category: 'refrigerantes'
  },
    {
    id: 8,
    name: 'Batata Frita',
    price: 25.00,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80',
    category: 'acompanhamentos'
  },

 
    {
      id: 9,
      name: 'Hambúrguer Vegetariano',
      price: 35.90,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80',
      category: 'hamburguers'
    },
    {
      id: 10,
      name: 'Hambúrguer de Frango',
      price: 37.90,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80',
      category: 'hamburguers'
    },
    {
      id: 11,
      name: 'Hambúrguer de Carne',
      price: 39.90,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80',
      category: 'hamburguers'
    },
    {
      id: 12,
      name: 'Refrigerante de Laranja',
      price: 5.00,
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80',
      category: 'refrigerantes'
    },
    {
      id: 13,
      name: 'Refrigerante de Limão',
      price: 5.00,
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80',
      category: 'refrigerantes'
    },
    {
      id: 14,
      name: 'Refrigerante de Uva',
      price: 5.00,
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80',
      category: 'refrigerantes'
    },
    {
      id: 15,
      name: 'Batata Doce Frita',
      price: 25.00,
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80',
      category: 'acompanhamentos'
    },
    {
      id: 16,
      name: 'Batata Frita com Cheddar',
      price: 30.00,
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80',
      category: 'acompanhamentos'
    },
    {
      id: 17,
      name: 'Batata Frita com Bacon',
      price: 30.00,
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80',
      category: 'acompanhamentos'
    },
  
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
  const [activeTab, setActiveTab] = useState<string>('sucos');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customersCount, setCustomersCount] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const menuTabs = ['sucos', 'pizzas', 'hamburguers','refrigerantes', 'acompanhamentos'];
  const tabsRef = useRef<HTMLDivElement>(null); // Reference to the tabs container

  useEffect(() => {
    if (mesa) {
      TableController.getInstance().updateTableStatus(Number(mesa), 'occupied', customersCount);

      console.log("Total de itens no carrinho",MENU_ITEMS.filter(item => item.category === activeTab).length)
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
    setTotalItems(prev => prev + 1); // Incrementa o contador
  };
  
  const removeFromCart = (itemId: number) => {
    setCart(current => {
      const existing = current.find(i => i.id === itemId);
      if (existing && existing.quantity > 1) {
        setTotalItems(prev => prev - 1); // Decrementa o contador
        return current.map(i =>
          i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      if (existing) {
        setTotalItems(prev => prev - existing.quantity); // Remove todos os itens
      }
      return current.filter(i => i.id !== itemId);
    });
  };

  const handleOpenCart = () => {
    setIsCartOpen(true);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

    const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
    if (tabsRef.current) {
      const tabElement = tabsRef.current.querySelector(`[data-value="${newValue}"]`);
      if (tabElement) {
        const rect = tabElement.getBoundingClientRect();
        tabsRef.current.scrollLeft = rect.left - (tabsRef.current.offsetWidth / 2) + (rect.width / 2);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-300 flex flex-col md:flex-row">



      {/* Cart Section (Mobile - Modal) */}
      <Dialog open={isCartOpen} onClose={handleCloseCart} fullWidth maxWidth="sm">
        <DialogTitle>Pedido</DialogTitle>
        <DialogContent>
          <div className="space-y-2 mb-2">
            <TextField
              fullWidth
              margin="normal"
              label="Nome do Cliente"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Nome do cliente"
            />

            <TextField
              fullWidth
              margin="normal"
              type="number"
              label="Número de Pessoas"
              value={customersCount}
              onChange={(e) => setCustomersCount(Number(e.target.value))}
              inputProps={{ min: "1" }}
            />
          </div>

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
          </div>
        </DialogContent>
        <Button
          fullWidth
          onClick={handleFinishOrder}
          disabled={cart.length === 0 || !customerName}
          className="w-full mt-4 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
        >
          Finalizar Pedido
        </Button>
      </Dialog>

      {/* Cart Section (Desktop) */}
      <aside className="w-full md:w-1/3 bg-white p-4 shadow-lg md:block hidden">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome do Cliente
          </label>
          <TextField
            fullWidth
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Nome do cliente"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de Pessoas
          </label>
          <TextField
            fullWidth
            type="number"
            label="Número de Pessoas"
            value={customersCount}
            onChange={(e) => setCustomersCount(Number(e.target.value))}
            inputProps={{ min: "1" }}
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
          <Button
            fullWidth
            onClick={handleFinishOrder}
            disabled={cart.length === 0 || !customerName}
            className="w-full mt-4 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
          >
            Finalizar Pedido
          </Button>
        </div>
      </aside>

      {/* Menu Section */}
      
      <main className="flex-1 p-4">


        {/* Tabs for Categories */}
        <div ref={tabsRef} className="overflow-x-auto mb-6">
            <AppBar position="static" style={{ backgroundColor: '#424242' }}>
            <Toolbar>
              <Typography variant="h6" style={{ flexGrow: 1 }}>
                Cardapio PDV
              </Typography>
            </Toolbar>
          </AppBar>
 
     
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs"
            
          >
            {menuTabs.map((tab) => (
              <Tab key={tab} label={tab} value={tab} data-value={tab} />
            ))}
          </Tabs>
        </div>
        {/* Menu Items Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {MENU_ITEMS.filter(item => item.category === activeTab).map((item) => (
            <div
              key={item.id}
              className="bg-blue rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">R$ {item.price.toFixed(2)}</p>
                <Button
                  fullWidth
                  onClick={() => addToCart(item)}
                  className="mt-2 bg-blue-900 text-white py-2 rounded-md hover:bg-blue-900 text-white"
                >
                  Adicionar
                </Button>
              </div>
            </div>
          ))}
        </div>


        {/* Mobile Cart Button */}
        <Fab
            variant="extended"
            size="medium"
            color="primary"
            className="md:hidden fixed top-10 left-20 bg-blue-600 text-white"
            onClick={handleOpenCart}
          >
            <NavigationIcon />
            Fazer Pedido {totalItems > 0 && `(${totalItems})`} {/* Exibe o contador */}
          </Fab>
      </main>
    </div>
  );
};

export default CardapioPDV;
