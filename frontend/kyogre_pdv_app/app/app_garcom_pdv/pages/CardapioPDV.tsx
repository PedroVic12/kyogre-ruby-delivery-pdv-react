import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Minus, NavigationIcon } from 'lucide-react';
import PedidoController from '../controllers/PedidoController';
import TableController from '../controllers/TableController';
import { Fab, Dialog, DialogTitle, DialogContent, TextField, Button, Tabs, Tab, AppBar, Toolbar, Typography, Box, CircularProgress } from '@mui/material';

import ProductCardapioRepository from "../../../src/repositories/cardapio_repository"; // Import ProductRepository and types

import {Product, Category} from "../../../src/types/menu"

interface CartItem extends Product { // CartItem now extends Product
  quantity: number;
}

const CardapioPDV = () => {
  const { mesa } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>(''); // Initialize as empty string, will be set from categories
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customersCount, setCustomersCount] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]); // State to hold categories from repository
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
  const tabsRef = useRef<HTMLDivElement>(null);


  //!Loading o controlador do cardapio pegando do supabase
  const productRepository = new ProductCardapioRepository();

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const fetchedCategories = await productRepository.fetchProducts();
        setCategories(fetchedCategories);
        if (fetchedCategories.length > 0) {
          setActiveTab(fetchedCategories[0].name.toLowerCase()); // Set initial tab to the first category
        }
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        // Handle error appropriately, maybe show an error message to the user
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

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

  const addToCart = (item: Product) => { // item is now of type Product
    setCart(current => {
      const existing = current.find(i => i.id === item.id);
      if (existing) {
        return current.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...current, { ...item, quantity: 1 }];
    });
    setTotalItems(prev => prev + 1);
  };

  const removeFromCart = (itemId: number) => {
    setCart(current => {
      const existing = current.find(i => i.id === itemId);
      if (existing && existing.quantity > 1) {
        setTotalItems(prev => prev - 1);
        return current.map(i =>
          i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      if (existing) {
        setTotalItems(prev => prev - existing.quantity);
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
  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div>
        <CircularProgress size="120px" />
        <br />
        <h2>Carregando pedidos...</h2>
      </div>
    </div>; // Simple loading message
  }

  return (
    <div className="min-h-screen  flex flex-col md:flex-row">

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
                <Box sx={{ width: 40, height: 40, bgcolor: '#e0e0e0', mr: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.imageUrl ?
                    <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit:'cover' }} /> :
                    <Box sx={{ width: '100%', height: '100%', border: '1px solid #ccc' }} />
                  }
                </Box>
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
                    onClick={() => addToCart(categories.find(cat => cat.name.toLowerCase() === activeTab)?.products.find(prod => prod.id === item.id)!)} // Find item in categories
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
              <Box sx={{ width: 40, height: 40, bgcolor: '#e0e0e0', mr: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.imageUrl ?
                    <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit:'cover' }} /> :
                    <Box sx={{ width: '100%', height: '100%', border: '1px solid #ccc' }} />
                  }
                </Box>
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
                  onClick={() => addToCart(categories.find(cat => cat.name.toLowerCase() === activeTab)?.products.find(prod => prod.id === item.id)!)} // Find item in categories
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
      <main className="flex-1 ">
        {/* Tabs for Categories */}
        <div ref={tabsRef} className="overflow-x-auto mb-6">
          <AppBar position="static" style={{ backgroundColor: '#054f77', display: 'flex', justifyContent: 'center' }}>
            <Toolbar>
              <Typography variant="h6">
                Cardapio PDV
              </Typography>
            </Toolbar>
          </AppBar>


          {/* Tabs de navegacao */}
          <Box sx={{ backgroundColor: '#C0C0C0', padding: 2, borderRadius: 1 }}>
          <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs"
              color='primary'
              textColor='secondary'
            >
              {categories.map((tab) => (
                <Tab key={tab.name} label={tab.name} value={tab.name.toLowerCase()} data-value={tab.name.toLowerCase()} />
              ))}
            </Tabs>
          </Box>


        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 p-2 ">
          {categories.find(cat => cat.name.toLowerCase() === activeTab)?.products.map((item) => ( // Access products from the selected category
            <div
              key={item.id}
              className="bg-gray-300 p-4 rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">R$ {item.price.toFixed(2)}</p>
                <br />
                <button
                  onClick={() => addToCart(item)}
                  className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-3 border-b-4 border-blue-700 hover:border-blue-500 rounded"
                >
                  Adicionar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Cart Button */}
        <Fab
                variant="extended"
                size="large"
                color="primary"
                className="md:hidden fixed bg-blue-600 text-white"
                onClick={handleOpenCart}
                style={{position: 'fixed', top: 500, right: 10, zIndex: 9999}}
          >
                <NavigationIcon className='mr-2'/>
                Fazer Pedido {totalItems > 0 && `(${totalItems})`}
          </Fab>
      </main>
    </div>
  );
};

export default CardapioPDV;
