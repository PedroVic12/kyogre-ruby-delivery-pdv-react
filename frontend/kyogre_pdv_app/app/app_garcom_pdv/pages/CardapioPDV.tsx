import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Minus, NavigationIcon } from 'lucide-react';
import PedidoController from '../controllers/PedidoController';
import TableController from '../controllers/TableController';
import { Fab, Dialog, DialogTitle, DialogContent, TextField, Tabs, Tab, AppBar, Toolbar, Typography, Box, CircularProgress } from '@mui/material';
import { Product, Category } from "../../../src/types/menu"
import CardapioService from '../../../src/controllers/cardapio_controller';
import { useAuth } from '../../../src/contexts/AuthContext';
import PessoasChips from '../widgets/PessoasChip';

interface CartItem extends Product { // CartItem now extends Product
  quantity: number;
}

//!Loading o controlador do cardapio pegando do supabase
const pedidoController = PedidoController.getInstance();


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
  const [cartsByPerson, setCartsByPerson] = useState<Record<string, CartItem[]>>({});
  const [selectedPersonId, setSelectedPersonId] = useState<string>('mesa');
  
  const {token} = useAuth()
  const productRepository = new CardapioService(token);


  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const fetchedCategories = await productRepository.fetchProdutosCardapioDigital();
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
    const pedidos = pedidoController.loadPedidos();
    console.log(pedidos);
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

    const now = new Date();
    const dataPedido = {
      data: `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`,
      hora: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
    };

    const carrinho = cart.map(item => ({
      quantidade: item.quantity,
      nome: item.nome_produto,
      preco: item.preco,
    }));

    const newPedido = pedidoController.createPedido({
      nome_cliente: customerName,
      complemento: `Mesa ${mesa ? mesa.charAt(0).toUpperCase() + mesa.slice(1) : ''}`,
      total_pagar: calculateTotal(),
      data_pedido: dataPedido,
      carrinho: carrinho,
    });

    console.log("Novo Pedido", newPedido)

    navigate(`/checkout/${newPedido.id}`);
  };



  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.preco * item.quantity), 0);
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
        <h2>Carregando cardapio...</h2>
      </div>
    </div>; // Simple loading message
  }

  


  return (
    <div className="min-h-screen  flex flex-col md:flex-row">

      {/* Cart Section (Mobile - Modal) */}
      <Dialog open={isCartOpen} onClose={handleCloseCart} fullWidth maxWidth="sm">
        <DialogTitle>Pedido da mesa {mesa}</DialogTitle>
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
                  {item.url_imagem ?
                    <img src={item.url_imagem} alt={item.nome_produto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> :
                    <Box sx={{ width: '100%', height: '100%', border: '1px solid #ccc' }} />
                  }
                </Box>
                <div>
                  <p className="font-medium">{item.nome_produto}</p>
                  <p className="text-sm text-gray-500">R$ {item.preco.toFixed(2)}</p>
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
                    onClick={() => {
                      const product = categories.find(cat => cat.name.toLowerCase() === activeTab)?.products.find(prod => prod.id === item.id);
                      if (product) {
                        addToCart(product);
                      }
                    }} // Find item in categories
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
        <button
          onClick={handleFinishOrder}
          disabled={cart.length === 0 || !customerName}
          className="w-full mt-4 mb-4 bg-green-600 text-white py-2 rounded-md disabled:bg-gray-600"
        >
          Finalizar Pedido
        </button>
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
        
        <PessoasChips  />

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

        <h2 className="text-lg font-semibold mb-4">Pedido da mesa </h2>
        <div className="space-y-4 mb-4">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <Box sx={{ width: 40, height: 40, bgcolor: '#e0e0e0', mr: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {item.url_imagem ?
                  <img src={item.url_imagem} alt={item.nome_produto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> :
                  <Box sx={{ width: '100%', height: '100%', border: '1px solid #ccc' }} />
                }
              </Box>
              <div>
                <p className="font-medium">{item.nome_produto}</p>
                <p className="text-sm text-gray-500">R$ {item.preco.toFixed(2)}</p>
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
                  onClick={() => {
                    const category = categories.find(cat => cat.name.toLowerCase() === activeTab);
                    const product = category?.products.find(prod => prod.id === item.id);
                    if (product) {
                      addToCart(product);
                    }
                  }} // Find item in categories
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
            className="w-full mt-4 mb-4 bg-green-600 text-white py-2 rounded-md disabled:bg-gray-600"
          >
            Finalizar Pedido
          </button>
        </div>
      </aside>

      {/* Menu Section */}
      <main className="flex-1 ">
        {/* Tabs for Categories */}
        <div ref={tabsRef} className="overflow-x-auto mb-6">
          <AppBar position="static" style={{ backgroundColor: '#054f77', display: 'flex', justifyContent: 'center' }}>
            <Toolbar>

              <Typography variant="h4">
                Sistema PDV
              </Typography>
            </Toolbar>
          </AppBar>


          {/* Tabs de navegacao */}
          <Box sx={{ backgroundColor: '#B0C4DE', padding: 1, borderRadius: 3}}>

            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs"
              color='primary'
              textColor='primary'
            >
              {categories.map((tab) => (
                <Tab key={tab.name}   label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <h1 style={{ fontSize: '1.2rem' }}>{tab.name}</h1> 
                  </Box>
                }value={tab.name.toLowerCase()} data-value={tab.name.toLowerCase()}          sx={{
                  '&.Mui-selected': {
                    color: '#0000FF',
                    backgroundColor: '#FFFFE0',
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: '#D3D3D3',
                    },
                  },
                }}
                
                />
              ))}
            </Tabs>
          </Box>


        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 p-2 ">
          {categories.find(cat => cat.name.toLowerCase() === activeTab)?.products.map((item) => (
            <div
              key={item.id}
              className="bg-sky-800 hover:bg-amber-500 p-2 rounded-lg shadow-md overflow-hidden"
            >


              <img
                src={item.url_imagem}
                alt={item.nome_produto}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="font-semibold">{item.nome_produto}</h2>
                <p className="text-gray-100 font-semibold">R$ {item.preco.toFixed(2)}</p>
                <br />
                <button
                  onClick={() => addToCart(item)}
                  className="bg-emerald-700 hover:bg-purple-900 text-white font-bold py-2 px-3 border-b-6 border-emerald-700 hover:border-red-500 rounded"
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
          style={{
            position: 'fixed',
            bottom: 20, // Ensure it stays at the bottom of the screen
            right: 20,
            zIndex: 9999,
          }}
        >
          <NavigationIcon className="mr-2" />
          Anotar Pedido {totalItems > 0 && `(${totalItems})`}
        </Fab>
        <br />
        <br />
        <br />
        <br />
      </main>



    </div>
  );
};

export default CardapioPDV;