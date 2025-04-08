import React, { useState, useMemo, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  AppBar,
  Toolbar,
  CircularProgress,
} from '@mui/material';

import { Cart } from '../../components/cardapio/Cart';
import { CartDialog } from '../../components/cardapio/CartDialog';
import { CategoryTabs } from '../../components/cardapio/CategoryTabs';
import { SearchBar } from '../../components/cardapio/SearchBar';
import { FeaturedCarousel } from '../../components/cardapio/FeaturedCarousel';
import { useNavigate } from 'react-router-dom';
import { MenuCard } from '../../components/cardapio/MenuCard';
import ProductCardapioRepository from '../../repositories/cardapio_repository';
import { Category, Product } from '../../types/menu';
import { useCart } from '../../contexts/CartContext';

export const CardapioDigitalPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, total, itemCount, addToCart, removeFromCart, updateQuantity } = useCart();
  const [openCart, setOpenCart] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pedidoId, setPedidoId] = useState<number | null>(null); // Estado para o ID do pedido

  const productRepository = new ProductCardapioRepository();

  //const pedidoController = PedidoController.getInstance();


  useEffect(() => {
    // Gerar um ID único para o pedido ao acessar a página
    const generatedId = Math.floor(Math.random() * 9000) + 1000;
    setPedidoId(generatedId);

    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const fetchedCategories = await productRepository.fetchProducts();
        setCategories(fetchedCategories);
        const allProds: Product[] = fetchedCategories.flatMap(cat => cat.products);
        setAllProducts(allProds);
        if (fetchedCategories.length > 0) {
          setSelectedCategory(fetchedCategories[0].name);
        }
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const featuredProducts = useMemo(() => {
    return [...allProducts]
      .sort((a, b) => b.price - a.price)
      .slice(0, 5);
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return [];
    const categoryProducts = allProducts.filter(product =>
      product.categoria === selectedCategory
    );

    if (!searchQuery) return categoryProducts;

    return categoryProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allProducts, selectedCategory, searchQuery]);

  const handleCardClick = (itemId: number) => {
    navigate(`/product/${itemId}`);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><CircularProgress /></div>;
  }

  return (
    <Box sx={{ pb: 8 }}>
      <AppBar
        position="static"
        sx={{
          background: 'linear-gradient(180deg, #000000 0%, #1a1a1a 100%)',
          color: 'white',
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
           Sua Lanchonete | Pedido: #{pedidoId}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 3 }}>
        <Box component="section" sx={{ mb: 3 }}>
          <SearchBar onSearch={setSearchQuery} />
        </Box>

        <Box component="section" sx={{ mb: 2 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
            Destaques
          </Typography>
          <FeaturedCarousel items={featuredProducts} />
        </Box>

        <Box component="section" sx={{ mb: 2 }}>
          <CategoryTabs
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </Box>

        <Box component="section">
          {filteredProducts.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              onAddToCart={addToCart}
              onClick={() => handleCardClick(item.id)}
            />
          ))}
          {filteredProducts.length === 0 && (
            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                py: 4,
                color: 'text.secondary'
              }}
            >
              Nenhum produto encontrado
            </Typography>
          )}
        </Box>
      </Container>

      <Cart
        total={total}
        itemCount={itemCount}
        onViewCart={() => setOpenCart(true)}
      />

      <CartDialog
        open={openCart}

        pedidoId={pedidoId} // Passando o pedidoId como prop

        onClose={() => setOpenCart(false)}
        items={items}
        total={total}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
      />
    </Box>
  );
};
