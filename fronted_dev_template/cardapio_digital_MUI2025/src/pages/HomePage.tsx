import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  AppBar,
  Toolbar,
  useTheme,
} from '@mui/material';
import { MenuCard } from '../components/MenuCard';
import { Cart } from '../components/Cart';
import { CartDialog } from '../components/CartDialog';
import { CategoryTabs } from '../components/CategoryTabs';
import { ProductRepository } from '../repositories/ProductRepository';
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { items, total, itemCount, addToCart, removeFromCart, updateQuantity } = useCart();
  const [openCart, setOpenCart] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = useState('sanduiches');

  const categories = ProductRepository.getCategories();
  const products = ProductRepository.getProductsByCategory(selectedCategory);

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
        <CategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {products.map((item) => (
          <MenuCard
            key={item.id}
            item={item}
            onAddToCart={addToCart}
            onClick={() => handleCardClick(item.id)}
          />
        ))}
      </Container>

      <Cart
        items={items}
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