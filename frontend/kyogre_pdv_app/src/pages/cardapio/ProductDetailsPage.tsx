// src/pages/cardapio/ProductDetailsPage.tsx
import React, { useState, useEffect } from 'react';
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
  CircularProgress,
} from '@mui/material';

import { ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import ProductCardapioRepository from '../../repositories/cardapio_repository';
import { Product } from '../../types/menu';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [item, setItem] = useState<Product | undefined>(undefined);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const productCardapioRepository = new ProductCardapioRepository();

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      try {
        if (id) {
          const fetchedCategories = await productCardapioRepository.fetchProducts();
          const allProds: Product[] = fetchedCategories.flatMap(cat => cat.products);
          const product = allProds.find(prod => prod.id === Number(id));
          setItem(product);
        }
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><CircularProgress /></div>;
  }

  if (!item) {
    return <Typography>Product not found</Typography>;
  }

  const handleAddonToggle = (addonName: string) => {
    setSelectedAddons((current) =>
      current.includes(addonName)
        ? current.filter((name) => name !== addonName)
        : [...current, addonName]
    );
  };

  const calculateTotal = () => {
    let addonsTotal = 0;
    if (item.adicionais && Array.isArray(item.adicionais)) {
      item.adicionais.forEach(addon => {
        if (selectedAddons.includes(addon.nome_adicional)) {
          addonsTotal += addon.preco;
        }
      });
    }
    return item.price + addonsTotal;
  };
  const handleAddToCart = () => {
    if (item) {
      const selectedAdicionais = item.adicionais?.filter(addon =>
        selectedAddons.includes(addon.nome_adicional)
      ) || [];

      const itemToAdd = {
        ...item,
        price: calculateTotal(),
        adicionais: selectedAdicionais,
      };

      console.log("Adicionando ao carrinho:", itemToAdd);
      addToCart(itemToAdd);
      navigate('/cardapio');
    }
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
            onClick={() => navigate('/cardapio')}
            sx={{ mr: 2 }}
          >
            <ArrowLeft />
          </IconButton>
          <Typography variant="h6">Product Details</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 2 }}>
        <Box
          component="img"
          src={item.imageUrl}
          alt={item.name}
          sx={{
            width: '100%',
            height: 300,
            objectFit: 'fill',
            borderRadius: 5,
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

        {item.adicionais && Array.isArray(item.adicionais) && item.adicionais.length > 0 && (
          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Adicionais
            </Typography>
            {item.adicionais.map((adicional, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={selectedAddons.includes(adicional.nome_adicional)}
                    onChange={() => handleAddonToggle(adicional.nome_adicional)}
                  />
                }
                label={`${adicional.nome_adicional} (+R$ ${adicional.preco.toFixed(2)})`}
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
            Adicionar ao Carrinho - R$ {calculateTotal().toFixed(2)}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};
