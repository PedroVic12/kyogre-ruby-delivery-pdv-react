import { MenuCategory } from '../../components/menu/MenuCategory';
import { AddProductModal } from '../../components/menu/AddProductModal';
import { useState, useEffect } from 'react';
import { Category, Product } from '../../types/menu';
import { Button, CircularProgress, Box, Paper, Typography, Collapse, IconButton, Stack } from '@mui/material';
import { green, blue, red } from '@mui/material/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { cardapioService } from '../../controllers/cardapio_controller';


export function useMenuState() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      const produtos = await cardapioService.buscarProdutos();
      
      // Agrupa produtos por categoria
      const categoriaMap = new Map<string, Product[]>();
      produtos.forEach(produto => {
        if (!categoriaMap.has(produto.categoria)) {
          categoriaMap.set(produto.categoria, []);
        }
        categoriaMap.get(produto.categoria)?.push({
          id: produto.id,
          name: produto.nome_produto,
          price: produto.preco,
          imageUrl: produto.url_imagem,
          description: produto.descricao,
          isAvailable: produto.disponivel
        });
      });

      // Converte o Map para o formato de categorias
      const novasCategorias: Category[] = Array.from(categoriaMap).map(([name, products]) => ({
        id: name,
        name,
        products
      }));

      setCategories(novasCategorias);
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setIsLoading(false);
    }
  };

  const handleAddProduct = async (formData: any) => {
    try {
      const novoProduto = await cardapioService.criarProduto({
        nome_produto: formData.name,
        preco: formData.price,
        categoria: formData.category,
        url_imagem: formData.imageUrl,
        descricao: formData.description,
        disponivel: true
      });
      console.log('Produto adicionado com sucesso:', novoProduto);
      await carregarProdutos(); // Recarrega os produtos
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
    }
  };

  const handleDeleteProduct = async ( productId: string) => {
    try {
      await cardapioService.deletarProduto(productId);
      await carregarProdutos(); // Recarrega os produtos
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    // TODO: Implementar lógica para deletar categoria (backend e frontend)
    alert(`Deletar categoria ${categoryId} - Funcionalidade de deletar categoria não implementada no backend ainda.`);
    console.log(`Deletar categoria ${categoryId}`);
    // await carregarProdutos(); // Recarrega os produtos após deletar categoria (se implementar backend)
  };

  const handleEditProduct = async (productId: string, productData: Product) => {
    // TODO: Implementar lógica para editar produto (modal de edição, chamada à API, etc.)
    alert(`Editar produto ${productData.name} (ID: ${productId}) - Funcionalidade de editar produto não implementada ainda.`);
    console.log(`Editar produto ${productId}`, productData);
  };


  return {
    categories,
    isModalOpen,
    setIsModalOpen,
    handleAddProduct,
    handleDeleteProduct,
    handleDeleteCategory, // expose a função para deletar categoria
    handleEditProduct, // expose a função para editar produto
    isLoading
  };
}


//! Front end de gerenciador do cardapio

function TestePedidoButton() {
  const [mensagem, setMensagem] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [detalhesResposta, setDetalhesResposta] = useState<any>(null);
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);

  // Limpar mensagem após 8 segundos quando houver sucesso ou erro
  useEffect(() => {
    if (status === 'success' || status === 'error') {
      const timer = setTimeout(() => {
        setMensagem('');
        setStatus('idle');
      }, 8000);
      
      return () => clearTimeout(timer);
    }
  }, [status]);

  const fazerPedido = async () => {
    setIsLoading(true);
    setStatus('loading');
    setMensagem('Enviando pedido...');
    setDetalhesResposta(null);
    setMostrarDetalhes(false);
    
    console.log('Iniciando envio do pedido de teste...');

    const pedidoData = {
      "id": 1861,
      "nome_cliente": "Pv",
      "telefone": "5521999289987",
      "endereco": "Niterói",
      "complemento": "Sem Complemento.",
      "forma_pagamento": "Dinheiro",
      "status": "Em Processo",
      "total_pagar": 96,
      "data_pedido": {
        "data": "06/03/2025",
        "hora": " 03:08:19"
      },
      "carrinho": [
        {
          "quantidade": 1,
          "nome": "Americano",
          "preco": 24
        },
        {
          "quantidade": 1,
          "nome": "Bauru",
          "preco": 42
        },
        {
          "quantidade": 1,
          "nome": "Filé de Carne",
          "preco": 30
        }
      ]
    };

    console.log('Dados do pedido:', pedidoData);

    try {
      const resposta = await fetch('https://docker-raichu.onrender.com/api/pedidos/', { // Use 'http://localhost:8000/api/pedidos/' para teste local
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        
        body: JSON.stringify(pedidoData),
      });

      console.log('Resposta recebida:', resposta.status);

      if (resposta.ok) {
        const data = await resposta.json();
        console.log('Pedido criado com sucesso:', data);
        setMensagem(`Pedido criado com sucesso!`);
        setStatus('success');
        setDetalhesResposta(data);
        alert('Pedido criado com sucesso!');
      } else {
        const erroTexto = await resposta.text();
        console.error('Erro ao criar pedido:', erroTexto);
        setMensagem(`Erro ao criar pedido. Status: ${resposta.status}`);
        setStatus('error');
        try {
          setDetalhesResposta(JSON.parse(erroTexto));
        } catch {
          setDetalhesResposta({ mensagem: erroTexto });
        }
        alert(`Erro ao criar pedido. Status: ${resposta.status}`);
      }
    } catch (error) {
      console.error('Exceção ao enviar requisição:', error);
      setMensagem(`Erro ao enviar requisição: ${error}`);
      setStatus('error');
      setDetalhesResposta({ mensagem: String(error) });
      alert(`Erro ao enviar requisição: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Cores para diferentes estados
  const getStatusColor = () => {
    switch (status) {
      case 'success': return green[500];
      case 'error': return red[500];
      case 'loading': return blue[500];
      default: return 'inherit';
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ position: 'relative' }}>
        <Button
          variant="contained"
          sx={{
            bgcolor: isLoading ? 'grey.400' : blue[600],
            '&:hover': {
              bgcolor: isLoading ? 'grey.400' : blue[700],
            },
            color: 'white',
            px: 3,
            py: 1,
            borderRadius: 2,
          }}
          disabled={isLoading}
          onClick={fazerPedido}
        >
          {isLoading ? 'Enviando...' : 'Fazer Pedido de Teste (POST)'}
        </Button>
        {isLoading && (
          <CircularProgress
            size={24}
            sx={{
              color: blue[500],
              position: 'absolute',
              top: '50%',
              left: '24px',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
        )}
      </Box>
      
      {mensagem && (
        <Paper 
          elevation={3}
          sx={{
            mt: 2,
            p: 2,
            bgcolor: getStatusColor(),
            color: 'white',
            borderRadius: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {status === 'loading' && (
              <CircularProgress size={20} sx={{ color: 'white' }} />
            )}
            <Typography variant="body1">{mensagem}</Typography>
            
            {detalhesResposta && (
              <IconButton 
                size="small" 
                sx={{ ml: 'auto', color: 'white' }}
                onClick={() => setMostrarDetalhes(!mostrarDetalhes)}
              >
                {mostrarDetalhes ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            )}
          </Box>
          
          <Collapse in={mostrarDetalhes}>
            <Box 
              sx={{ 
                mt: 2, 
                p: 1, 
                bgcolor: 'rgba(0, 0, 0, 0.1)', 
                borderRadius: 1,
                maxHeight: 200,
                overflow: 'auto',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                whiteSpace: 'pre-wrap'
              }}
            >
              {JSON.stringify(detalhesResposta, null, 2)}
            </Box>
          </Collapse>
        </Paper>
      )}
    </Box>
  );
}


export function MenuPage() {
  const {
    categories,
    isModalOpen,
    setIsModalOpen,
    handleAddProduct,
    handleDeleteProduct,
    handleDeleteCategory, // pega a função para deletar categoria
   // handleEditProduct, // pega a função para editar produto
    isLoading
  } = useMenuState();

  return (
    <div className="ml-2 pt-8 p-2 **overflow-x-auto**"> {/* Adiciona scroll horizontal se necessário */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Gerenciar Cardápio</h2>

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsModalOpen(true)}
          >
            Adicionar Novo Produto
          </Button>

          <TestePedidoButton />

          <Button
            variant="contained"
            color="secondary"
            onClick={() => alert('Funcionalidade em desenvolvimento')}
          >
            Adicionar Categoria
          </Button>
        </Stack>
      </div>

      {isLoading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <div className="**flex flex-col gap-6 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4**"> {/* Layout responsivo com flex e grid */}
          {categories.map((category) => (
            <MenuCategory
              key={category.id}
              category={category}
              onDeleteProduct={handleDeleteProduct}
              onDeleteCategory={handleDeleteCategory} // Passa a função para deletar categoria
              onEditProduct={handleAddProduct} // Passa a função para editar produto (por enquanto não usado)
            />
          ))}
        </div>
      )}

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddProduct}
      />
    </div>
  );
}