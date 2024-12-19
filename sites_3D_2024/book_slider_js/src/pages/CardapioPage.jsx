import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import { Loader } from "@react-three/drei";
import { Experience } from "../components/Experience";
import { motion, AnimatePresence } from "framer-motion";
import { atom, useAtom } from "jotai";
import { pageAtom, pages } from "../components/UI";
import { useLongPress } from 'use-long-press';
import { cardapioRepository } from "../repository/CardapioRepository";

const CategoryModal = ({ page, onClose, onOrder, addToCart, cartItems }) => {
  const items = cardapioRepository.getByPagina(page);

  const handleOrder = () => {
    if (cartItems.length > 0) {
      const orderData = cartItems.map(item => ({
        nome: item.nome,
        preco: item.preco,
        timestamp: new Date().toISOString(),
      }));
      onOrder(orderData); // Envia todos os itens do carrinho
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="fixed inset-0 bg-black/80 z-50 p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-lg p-4 max-w-lg mx-auto mt-20">
        <h2 className="text-2xl font-bold mb-4">Cardápio - Página {page + 1}</h2>
        <div className="space-y-4">
          {items.map((item) => (
            <div 
              key={item.id}
              className={`p-4 border rounded-lg cursor-pointer ${
                cartItems.some(cartItem => cartItem.id === item.id) ? 'border-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => addToCart(item)}
            >
              <h3 className="font-bold">{item.nome}</h3>
              <p className="text-gray-600">{item.descricao}</p>
              <p className="text-lg font-bold">R$ {item.preco.toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between items-center">
          <h3 className="font-bold">Total: R$ {cartItems.reduce((total, item) => total + item.preco, 0).toFixed(2)}</h3>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Fechar
          </button>
          <button 
            onClick={handleOrder}
            disabled={cartItems.length === 0}
            className={`px-4 py-2 rounded-lg ${
              cartItems.length > 0 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Enviar Pedido
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export function CardapioPage() {
  const [orientation, setOrientation] = useState('portrait');
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useAtom(pageAtom);
  const [carrinho, setCarrinho] = useState([]);

  const bind = useLongPress(() => {
    setShowModal(true);
  }, {
    threshold: 500,
  });

  useEffect(() => {
    const handleResize = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const addToCart = (item) => {
    setCarrinho((prev) => {
      const exists = prev.find(cartItem => cartItem.id === item.id);
      if (exists) {
        return prev.filter(cartItem => cartItem.id !== item.id); // Remove se já estiver no carrinho
      } else {
        return [...prev, item]; // Adiciona ao carrinho
      }
    });
  };

  const createOrderFile = () => {
    const fileContent = `Pedido:\n\n` +
      `| Item                | Preço   |\n` +
      `|---------------------|---------|\n` +
      carrinho.map(item => `| ${item.nome.padEnd(20)} | R$ ${item.preco.toFixed(2)} |`).join(`\n`) +
      `\nTotal: R$ ${carrinho.reduce((total, item) => total + item.preco, 0).toFixed(2)}\n`;

    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'assets/pedido.txt'; // Salva no diretório assets
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOrder = async (orderData) => {
    try {

      let enviado = true;

      console.log("enviadno os dados para cozinha...")

      // const response = await fetch('YOUR_API_ENDPOINT/orders', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(orderData),
      // });
      
      if (enviado) {
        createOrderFile(); // Cria arquivo de pedido
        alert('Seu pedido foi enviado para a cozinha!');
        setShowModal(false);
      }
    } catch (error) {
      console.error('Erro ao fazer pedido:', error);
      alert('Erro ao realizar pedido. Tente novamente.');
    }
  };

  return (
    <div className="w-full h-screen relative" {...bind()}>
      <Canvas
        shadows
        camera={{
          position: orientation === 'portrait' 
            ? [-0.5, 1, 9] 
            : [-0.5, 1, 4],
          fov: 45,
        }}
      >
        <group position-y={0}>
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
        </group>
      </Canvas>
      
      <Loader />
      
      {/* Navegação */}
      <div className="fixed bottom-4 left-0 right-0 flex justify-center items-center gap-2 z-50">
        <button
          className="bg-white/90 hover:bg-white px-4 py-2 rounded-lg text-sm font-medium"
          onClick={() => setPage((prev) => Math.max(0, prev - 1))}
        >
          Anterior
        </button>
        <span className="bg-white/90 px-3 py-1 rounded-lg text-sm">
          {page + 1} / {pages.length}
        </span>
        <button
          className="bg-white/90 hover:bg-white px-4 py-2 rounded-lg text-sm font-medium"
          onClick={() => setPage((prev) => Math.min(pages.length - 1, prev + 1))}
        >
          Próximo
        </button>
      </div>

      {/* Modal de Itens */}
      <AnimatePresence>
        {showModal && (
          <CategoryModal 
            page={page}
            onClose={() => setShowModal(false)}
            onOrder={handleOrder}
            addToCart={addToCart}
            cartItems={carrinho}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
