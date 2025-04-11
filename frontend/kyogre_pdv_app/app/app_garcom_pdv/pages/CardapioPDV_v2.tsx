import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Minus, Check, Send } from 'lucide-react'; // Ajustado Icones
import TableController from '../controllers/TableController';
import {
    Fab, Dialog, DialogTitle, DialogContent, Tabs, Tab, AppBar, Toolbar,
    Typography, Box, CircularProgress, Button, Stack, TextField, Chip
} from '@mui/material';
import { Product, Category } from "../../../src/types/menu"; // Ajuste o caminho se necessario
import CardapioService from '../../../src/controllers/cardapio_controller'; // Ajuste o caminho se necessario
import { useAuth } from '../../../src/contexts/AuthContext'; // Ajuste o caminho se necessario

import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person'; // Ícone para pessoa
import PeopleIcon from '@mui/icons-material/People'; // Ícone para Mesa
import PedidoController from '../controllers/PedidoController';

// Função para gerar IDs aleatórios de 4 dígitos
const generateRandomId = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Definir a estrutura da pessoa que será passada via props
interface Person {
  id: string;
  name: string;
}

// Definir as props que o componente receberá
interface PessoasChipsProps {
  people: Person[]; // Lista de pessoas gerenciada pelo componente pai
  selectedPersonId: string | null; // ID da pessoa/mesa selecionada, gerenciado pelo pai
  onSelectPerson: (id: string) => void; // Callback para notificar o pai sobre a seleção
  onAddPerson: (name: string) => void; // Callback para notificar o pai sobre adicionar pessoa
  onDeletePerson: (id: string) => void; // Callback para notificar o pai sobre remover pessoa
}

// Interface para itens no carrinho
interface CartItem extends Product {
    instanceId: string; // ID único desta linha no carrinho
    quantity: number;
    entityId: string; // ID da Person ou 'mesa'
  }
  
  // Componente de exibição do carrinho reutilizável
  interface CartDisplayProps {
    isMobile: boolean;
    people: Person[];
    selectedPersonId: string;
    itemsParaEntidadeSelecionada: CartItem[];
    totalItemsGeral: number;
    handleSelectPerson: (id: string) => void;
    handleAddPerson: (name: string) => void;
    handleDeletePerson: (id: string) => void;
    addToCart: (item: Product) => void;
    removeFromCart: (instanceId: string) => void;
    calculateTotalGeral: () => number;
    handleFinishOrder: () => void;
    mesa: string | undefined;
  }

  


function PessoasChips({
  people,
  selectedPersonId,
  onSelectPerson,
  onAddPerson,
  onDeletePerson
}: PessoasChipsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');

  const handleAddConfirm = () => {
    if (newName.trim() !== '') {
      onAddPerson(newName.trim()); // Chama o callback do pai
      setNewName('');
      setIsAdding(false);
    } else {
       setIsAdding(false); // Cancela se nome vazio
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleAddConfirm();
    } else if (event.key === 'Escape') {
      setIsAdding(false);
      setNewName('');
    }
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: 2, p: 1, border: '1px dashed grey', borderRadius: 1 }}>
       <Typography variant="subtitle2" sx={{ mr: 1, color: 'text.secondary' }}>Para:</Typography>
      {/* Chip Fixo da Mesa */}
      <Chip
        icon={<PeopleIcon />} // Icone para Mesa
        label="Mesa"
        color={selectedPersonId === 'mesa' ? 'primary' : 'default'}
        variant={selectedPersonId === 'mesa' ? 'filled' : 'outlined'}
        onClick={() => onSelectPerson('mesa')} // Chama o callback do pai
        clickable
        size="medium"
      />

      {/* Chips das Pessoas */}
      {people.map((person) => (
        <Chip
          icon={<PersonIcon />} // Icone para Pessoa
          key={person.id}
          label={person.name}
          onClick={() => onSelectPerson(person.id)} // Chama o callback do pai
          onDelete={() => onDeletePerson(person.id)} // Chama o callback do pai
          deleteIcon={<DeleteIcon />}
          color={selectedPersonId === person.id ? 'secondary' : 'default'}
          variant={selectedPersonId === person.id ? 'filled' : 'outlined'}
          clickable
          size="medium"
        />
      ))}

      {/* Adicionar Pessoa */}
      {isAdding ? (
        <TextField
          size="small"
          variant="outlined"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleAddConfirm} // Confirma ao perder o foco também
          autoFocus
          placeholder="Nome da Pessoa"
          sx={{ maxWidth: '200px' }}
        />
      ) : (
        <Chip
          icon={<AddIcon />}
          label="Pessoa"
          onClick={() => setIsAdding(true)}
          variant="outlined"
          clickable
          size="medium"
        />
      )}
    </Stack>
  );
}


const CartDisplay: React.FC<CartDisplayProps> = ({
  isMobile,
  people,
  selectedPersonId,
  itemsParaEntidadeSelecionada,
  handleSelectPerson,
  handleAddPerson,
  handleDeletePerson,
  addToCart,
  removeFromCart,
  calculateTotalGeral,
  handleFinishOrder,
  totalItemsGeral,
  mesa
}) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <Typography variant="h6" gutterBottom>
      Pedido - Mesa {mesa || 'N/A'}
    </Typography>

    {/* Passa estado e handlers para PessoasChips */}
    <PessoasChips
      people={people}
      selectedPersonId={selectedPersonId}
      onSelectPerson={handleSelectPerson}
      onAddPerson={handleAddPerson}
      onDeletePerson={handleDeletePerson}
    />

    <Typography variant="subtitle1" gutterBottom sx={{mt: 1}}>
      Itens para: <Chip size="medium" color={selectedPersonId === 'mesa' ? 'primary' : 'secondary'} label={selectedPersonId === 'mesa' ? 'Mesa (Compartilhado)' : people.find(p => p.id === selectedPersonId)?.name || '...'} />
    </Typography>

    {/* Lista de Itens (Scrollable) */}
    <Box className="space-y-3 mb-3" sx={{ flexGrow: 1, overflowY: 'auto', p: 0.5, minHeight: '150px' }}>
      {itemsParaEntidadeSelecionada.length === 0 ? (
        <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 4 }}>
          Nenhum item adicionado para {selectedPersonId === 'mesa' ? 'a mesa' : people.find(p => p.id === selectedPersonId)?.name}.
        </Typography>
      ) : (
        itemsParaEntidadeSelecionada.map((item) => (
          <div key={item.instanceId} className="flex justify-between items-center">
            {/* Imagem */}
            <Box sx={{ width: 40, height: 40, mr: 1.5, flexShrink: 0 }}>
              {item.url_imagem ?
                <img src={item.url_imagem} alt={item.nome_produto} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} /> :
                <Box sx={{ width: '100%', height: '100%', border: '1px solid #eee', borderRadius: '4px', bgcolor: '#f0f0f0' }} />
              }
            </Box>
            {/* Nome e Preço */}
            <div style={{ flexGrow: 1, marginRight: '8px' }}>
              <Typography variant="body2" fontWeight="medium" noWrap title={item.nome_produto}>{item.nome_produto}</Typography>
              <Typography variant="caption" color="textSecondary">R$ {item.preco.toFixed(2)}</Typography>
            </div>
            {/* Controles */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <Button
                size="small" variant="outlined" color="error"
                onClick={() => removeFromCart(item.instanceId)}
                sx={{ minWidth: '30px', padding: '4px' }}
              >
                <Minus size={14} />
              </Button>
              <Typography sx={{ minWidth: '20px', textAlign: 'center', fontSize:'0.9rem' }}>{item.quantity}</Typography>
              <Button
                size="small" variant="outlined" color="success"
                onClick={() => addToCart(item)} // Re-passa o item original para adicionar mais um
                sx={{ minWidth: '30px', padding: '4px' }}
              >
                <Plus size={14} />
              </Button>
            </div>
          </div>
        ))
      )}
    </Box>

    {/* Total e Botão Finalizar */}
    <Box className="border-t pt-3 mt-auto">
      <div className="col justify-between text-lg font-semibold mb-3">
        <Typography variant="h6">Total da Mesa:</Typography>

        <Typography variant="h6">R$ {calculateTotalGeral().toFixed(2)}</Typography>
        <br />
        <h1>Total do cliente {}</h1>



      </div>
      <Button
        variant="contained" color="success" fullWidth size="large"
        startIcon={<Send />}
        onClick={handleFinishOrder}
        disabled={totalItemsGeral === 0} // Desabilita se não houver NENHUM item
      >
        {isMobile ? 'Revisar e Finalizar' : 'Finalizar Pedido'}
      </Button>
    </Box>
  </Box>
);

// Componente principal
const CardapioSistemaPDV = () => {
  const pedidoController = PedidoController.getInstance();

  const { mesa } = useParams<{ mesa: string }>();
  const navigate = useNavigate();
  const { token } = useAuth(); // Obter token do contexto

  // --- State ---
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Estado unificado para pessoas e seleção (gerenciado aqui)
  const [people, setPeople] = useState<Person[]>([]);
  const [selectedPersonId, setSelectedPersonId] = useState<string>('mesa'); // 'mesa' como default

  // Novo estado para carrinhos por pessoa/mesa
  const [cartsByPerson, setCartsByPerson] = useState<Record<string, CartItem[]>>({});

  const [isCartOpen, setIsCartOpen] = useState(false);


  const [tables, setTables]= useState<any[]>([]);
  

  // Service Instance
  const cardapioService = useMemo(() => {
    if (!token) return null; // Retorna null se não houver token
    return new CardapioService(token);
  }, [token]);

  // --- Effects ---
  useEffect(() => {


    if (!cardapioService) {
      console.error("Serviço de cardápio não inicializado (sem token?)");
      setIsLoading(false);
      return;
    }

    const storedTables = localStorage.getItem('tables');
    if (storedTables) {
        setTables(JSON.parse(storedTables));
    }

    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const fetchedCategories = await cardapioService.fetchProdutosCardapioDigital();
        setCategories(fetchedCategories);
        if (fetchedCategories.length > 0 && fetchedCategories[0].name) {
          setActiveCategoryTab(fetchedCategories[0].name.toLowerCase());
        }
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        navigate("/login")
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [cardapioService]); 

  // Atualizar status da mesa
  useEffect(() => {
    if (mesa) {
        localStorage.setItem('tables', JSON.stringify(tables));
      TableController.getInstance().updateTableStatus(Number(mesa), 'ocupada', people.length);
    }
  }, [mesa, people.length]);

  // --- Handlers para Pessoas ---
  const handleSelectPerson = (id: string) => {
    setSelectedPersonId(id);
  };

  const handleAddPerson = (name: string) => {
    const newPerson: Person = { id: generateRandomId(), name };
    setPeople(current => [...current, newPerson]);
  };

  const handleDeletePerson = (idToDelete: string) => {
    setPeople(current => current.filter(person => person.id !== idToDelete));
    // Remover o carrinho da pessoa excluída
    setCartsByPerson(currentCarts => {
      const { [idToDelete]: _, ...remainingCarts } = currentCarts; // Remove a chave/valor
      return remainingCarts;
    });
    // Se a pessoa deletada estava selecionada, voltar para 'mesa'
    if (selectedPersonId === idToDelete) {
      setSelectedPersonId('mesa');
    }
  };

  // --- Handlers do Carrinho ---
  const addToCart = (item: Product) => {
    // selectedPersonId é usado como chave
    setCartsByPerson(prev => {
      const currentCart = prev[selectedPersonId] || []; // Pega o carrinho atual ou array vazio
      const existingIndex = currentCart.findIndex(i => i.id === item.id); // Apenas pelo ID do produto

      let updatedCart;
      if (existingIndex > -1) {
        // Aumenta quantidade
        updatedCart = currentCart.map((cartItem, index) =>
          index === existingIndex
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        // Adiciona novo item
        const newItem: CartItem = {
          ...item,
          instanceId: generateRandomId(),
          quantity: 1,
          entityId: selectedPersonId // Garante que está associado corretamente
        };
        updatedCart = [...currentCart, newItem];
      }
      return { ...prev, [selectedPersonId]: updatedCart }; // Atualiza o estado com o carrinho modificado
    });
  };

  const removeFromCart = (instanceIdToRemove: string) => {
    // selectedPersonId é usado como chave
    setCartsByPerson(prev => {
      const currentCart = prev[selectedPersonId] || [];
      const itemIndex = currentCart.findIndex(i => i.instanceId === instanceIdToRemove);

      if (itemIndex === -1) return prev; // Item não encontrado neste carrinho

      const item = currentCart[itemIndex];
      let updatedCart;

      if (item.quantity > 1) {
        // Diminui quantidade
        updatedCart = currentCart.map((cartItem, index) =>
          index === itemIndex
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      } else {
        // Remove item
        updatedCart = currentCart.filter((_, index) => index !== itemIndex);
      }

      return { ...prev, [selectedPersonId]: updatedCart };
    });
  };

  // --- Cálculos ---
  const calculateTotalGeral = () => {
    let total = 0;
    Object.values(cartsByPerson).forEach(personCart => {
      total += personCart.reduce((subtotal, item) => subtotal + (item.preco * item.quantity), 0);
    });
    return total;
  };

  const totalItemsGeral = useMemo(() => {
    let count = 0;
    Object.values(cartsByPerson).forEach(personCart => {
      count += personCart.reduce((subcount, item) => subcount + item.quantity, 0);
    });
    return count;
  }, [cartsByPerson]);

  const itemsParaEntidadeSelecionada = useMemo(() => {
    return cartsByPerson[selectedPersonId] || []; // Retorna array vazio se não houver carrinho
  }, [cartsByPerson, selectedPersonId]);

  // TODO --- Finalizar Pedido ---
  const handleFinishOrder = () => {
    const hasItems = Object.values(cartsByPerson).some(cart => cart.length > 0);
    if (!hasItems) {
      alert('Nenhum item foi adicionado ao pedido.');
      return;
    }

    if (!people) {
      alert('Por favor, insira o nome do cliente');
      return;
    }


    const now = new Date();
    const dataHoraPedido = {
      data: `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`,
      hora: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
    };

    const pedidosCarrinho = cartsByPerson.mesa.map(
      (item) => {
        console.log(item.quantity)
        console.log(item.nome_produto)
        console.log(item.preco)
        return {
          quantidade: item.quantity,
          nome: item.nome_produto,
          preco: item.preco
        };
      }
    );


    console.log("Carrinho", cartsByPerson.mesa)
    console.log(people.values)
      

    // --- TODO: Adaptar Controller/Backend para receber esta estrutura ---
    try {


       const novoPedidoPDV = pedidoController.createPedido({
         nome_cliente: people.values.name,
         complemento: `Mesa ${mesa ? mesa.charAt(0).toUpperCase() + mesa.slice(1) : 'N/A'}`,
         total_pagar: calculateTotalGeral(),
         data_pedido: {
           data: dataHoraPedido["data"],
           hora: dataHoraPedido["hora"],
         },
         carrinho:  pedidosCarrinho
       });
       console.log("\n\nNovo Pedido enviado do app de Garçom!", novoPedidoPDV)
      navigate(`/checkout/${novoPedidoPDV.id}`);

      alert("Pedido pronto para ser enviado ao Controller/Backend! (Implementação pendente)");


    } catch (error) {
      console.error("Erro ao tentar finalizar pedido:", error);
      alert("Erro ao finalizar pedido.");
    }
  };


  // --- Handlers restantes ---
  const handleOpenCart = () => setIsCartOpen(true);
  const handleCloseCart = () => setIsCartOpen(false);
  const handleCategoryTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setActiveCategoryTab(newValue);
  };

  // --- Loading ---
  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size="100px" />
        <br/>
        <Typography variant="h6">Carregando cardápio...</Typography>
      </div>
    );
  }
  
  if (!cardapioService) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography color="error">Erro de autenticação ou configuração.</Typography>
      </div>
    )
  }

  // --- Render Principal ---
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* --- Cart Section (Mobile - Modal) --- */}
      <Dialog open={isCartOpen} onClose={handleCloseCart} fullWidth maxWidth="sm">
        <DialogTitle sx={{ borderBottom: '1px solid #eee', pb: 1.5 }}>
          Revisar Pedido - Mesa {mesa || 'N/A'}
        </DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          <CartDisplay 
            isMobile={true}
            people={people}
            selectedPersonId={selectedPersonId}
            itemsParaEntidadeSelecionada={itemsParaEntidadeSelecionada}
            totalItemsGeral={totalItemsGeral}
            handleSelectPerson={handleSelectPerson}
            handleAddPerson={handleAddPerson}
            handleDeletePerson={handleDeletePerson}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            calculateTotalGeral={calculateTotalGeral}
            handleFinishOrder={handleFinishOrder}
            mesa={mesa}
          />
        </DialogContent>
      </Dialog>

      {/* --- Cart Section (Desktop - Sidebar) --- */}
      <Box component="aside" className="w-full md:w-1/3 lg:w-1/4 bg-white p-3 shadow-lg hidden md:flex md:flex-col">
        <CartDisplay 
          isMobile={false}
          people={people}
          selectedPersonId={selectedPersonId}
          itemsParaEntidadeSelecionada={itemsParaEntidadeSelecionada}
          totalItemsGeral={totalItemsGeral}
          handleSelectPerson={handleSelectPerson}
          handleAddPerson={handleAddPerson}
          handleDeletePerson={handleDeletePerson}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          calculateTotalGeral={calculateTotalGeral}
          handleFinishOrder={handleFinishOrder}
          mesa={mesa}
        />
      </Box>

      {/* --- Menu Section --- */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* AppBar */}
        <AppBar position="static" sx={{ backgroundColor: '#054f77' }}>
          <Toolbar>
            <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
              Sistema PDV - Mesa {mesa || 'N/A'}
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Category Tabs */}
        <Box sx={{ width: '100%', bgcolor: '#B0C4DE', borderBottom: 1, borderColor: 'divider', padding: 1  }}>
          <Tabs value={activeCategoryTab} onChange={handleCategoryTabChange} variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile>
            {categories.map((category) => (
              <Tab key={category.name} label={category.name} value={category.name.toLowerCase()} sx={{ textTransform: 'uppercase', fontSize: '1.4rem' }} />
            ))}
          </Tabs>
        </Box>

        {/* Product Grid (Scrollable) */}
        <Box className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categories.find(cat => cat.name.toLowerCase() === activeCategoryTab)?.products.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow hover:shadow-md overflow-hidden flex flex-col transition-shadow duration-150">
                <img src={item.url_imagem || 'https://via.placeholder.com/150'} alt={item.nome_produto} className="w-full h-32 sm:h-36 object-fill"/>
                <div className="p-3 flex flex-col flex-grow">
                  <Typography  component="h1" fontWeight="medium" gutterBottom noWrap title={item.nome_produto}>{item.nome_produto}</Typography>
                  <Typography variant="body1" color="success" fontWeight="medium" sx={{ mb: 1 }}>R$ {item.preco.toFixed(2)}</Typography>
                  <Button
                    variant="contained" size="medium"
                    onClick={() => addToCart(item)}
                    className="mt-auto w-full"
                    disabled={!selectedPersonId}
                    sx={{ backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#115200' } }}
                  >
                    <h1>Adicionar</h1>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Box>

        {/* FAB Mobile */}
        <Fab
          variant="extended" color="primary" aria-label="Revisar Pedido"
          className="md:hidden" onClick={handleOpenCart}
          sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1050, backgroundColor: '#054f77', '&:hover': { backgroundColor: '#033a57' } }}
        >
          <Check className="mr-1" />
          Revisar Pedido {totalItemsGeral > 0 && `(${totalItemsGeral})`}
        </Fab>
      </main>
    </div>
  );
};

export default CardapioSistemaPDV;