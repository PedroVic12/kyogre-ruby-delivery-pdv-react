import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Checkbox,
  FormControlLabel,
  Button,
  Paper,
} from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductRepository } from '../repositories/ProductRepository';
import { useCart } from '../hooks/useCart';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const item = id ? ProductRepository.getProductById(id) : undefined;
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  if (!item) {
    return <Typography>Produto não encontrado</Typography>;
  }

  const handleAddonToggle = (addonId: string) => {
    setSelectedAddons((current) =>
      current.includes(addonId)
        ? current.filter((id) => id !== addonId)
        : [...current, addonId]
    );
  };

  const calculateTotal = () => {
    const addonsTotal = (item.addons || [])
      .filter((addon) => selectedAddons.includes(addon.id))
      .reduce((sum, addon) => sum + addon.price, 0);
    return item.price + addonsTotal;
  };

  const handleAddToCart = () => {
    addToCart({
      ...item,
      price: calculateTotal(),
    });
    navigate('/');
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
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            <ArrowLeft />
          </IconButton>
          <Typography variant="h6">Detalhes do Produto</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 2 }}>
        <Box
          component="img"
          src={item.image}
          alt={item.name}
          sx={{
            width: '100%',
            height: 300,
            objectFit: 'cover',
            borderRadius: 2,
            mb: 2,
          }}
        />

        <Typography variant="h4" gutterBottom>
          {item.name}
        </Typography>
        
        <Typography variant="h5" color="primary" gutterBottom>
          R$ {item.price.toFixed(2)}
        </Typography>

        <Typography variant="body1" color="text.secondary" paragraph>
          {item.description}
        </Typography>

        {item.addons && item.addons.length > 0 && (
          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Adicionais
            </Typography>
            {item.addons.map((addon) => (
              <FormControlLabel
                key={addon.id}
                control={
                  <Checkbox
                    checked={selectedAddons.includes(addon.id)}
                    onChange={() => handleAddonToggle(addon.id)}
                  />
                }
                label={`${addon.name} (+R$ ${addon.price.toFixed(2)})`}
              />
            ))}
          </Paper>
        )}

        <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 2, bgcolor: 'background.paper' }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={handleAddToCart}
          >
            Adicionar ao Carrinho • R$ {calculateTotal().toFixed(2)}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};