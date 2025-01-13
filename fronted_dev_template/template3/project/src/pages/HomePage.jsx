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
import { SearchBar } from '../components/SearchBar';
import { FeaturedCarousel } from '../components/FeaturedCarousel';
import { ProductRepository } from '../repositories/ProductRepository';
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';

export const HomePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { items, total, itemCount, addToCart, removeFromCart, updateQuantity } = useCart();
  const [openCart, setOpenCart] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('sanduiches');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ProductRepository.getCategories();
  const allProducts = ProductRepository.getProductsByCategory(selectedCategory);
  const featuredProducts = ProductRepository.getAllProducts().slice(0, 5);

  const filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCardClick = (itemId) => {
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
        <section>
          <SearchBar onSearch={setSearchQuery} />
        </section>

        <section>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Destaques
          </Typography>
          <FeaturedCarousel items={featuredProducts} />
        </section>

        <section>
          <CategoryTabs
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </section>

        <section>
          {filteredProducts.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              onAddToCart={addToCart}
              onClick={() => handleCardClick(item.id)}
            />
          ))}
        </section>
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