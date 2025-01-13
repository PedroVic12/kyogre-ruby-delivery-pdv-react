import React, { useState, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  AppBar,
  Toolbar,
  //useTheme,
} from '@mui/material';


import { Cart } from '../../components/cardapio/Cart';
import { CartDialog } from '../../components/cardapio/CartDialog';
import { CategoryTabs } from '../../components/cardapio/CategoryTabs';
import { SearchBar } from '../../components/cardapio/SearchBar';
import { FeaturedCarousel } from '../../components/cardapio/FeaturedCarousel';
import { ProductRepository } from '../../repositories/ProductRepository';
import { useCart } from '../../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { MenuCard } from '../../components/cardapio/MenuCard';

export const CardapioDigitalPage: React.FC = () => {
  //const theme = useTheme();
  const navigate = useNavigate();
  const { items, total, itemCount, addToCart, removeFromCart, updateQuantity } = useCart();
  const [openCart, setOpenCart] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('sanduiches');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ProductRepository.getCategories();
  const allProducts = ProductRepository.getAllProducts();
  
  // Get featured products (first 5 products with highest prices)
  const featuredProducts = useMemo(() => {
    return [...allProducts]
      .sort((a, b) => b.price - a.price)
      .slice(0, 5);
  }, [allProducts]);

  // Filter products by category and search query
  const filteredProducts = useMemo(() => {
    const categoryProducts = allProducts.filter(product => 
      product.category === selectedCategory
    );

    if (!searchQuery) return categoryProducts;

    return categoryProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allProducts, selectedCategory, searchQuery]);

  const handleCardClick = (itemId: string) => {
    navigate(`/product/${itemId}`);
  };

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
            Sua Lanchonete | Pedido: #123
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 3 }}>
        <Box component="section" sx={{ mb: 4 }}>
          <SearchBar onSearch={setSearchQuery} />
        </Box>

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Destaques
          </Typography>
          <FeaturedCarousel items={featuredProducts} />
        </Box>

        <Box component="section" sx={{ mb: 4 }}>
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
        onClose={() => setOpenCart(false)}
        items={items}
        total={total}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
      />
    </Box>
  );
};