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
  TextField,
} from '@mui/material';

import { ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext'; // Importar do contexto global
import { Product } from '../../types/menu';
import CardapioService from '../../controllers/cardapio_controller';
import { useAuth } from '../../contexts/AuthContext';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart(); // Usar o contexto global
  const [item, setItem] = useState<Product | undefined>(undefined);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();

  const productCardapioRepository = new CardapioService(token);

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      try {
        if (id) {
          const fetchedCategories = await productCardapioRepository.fetchProdutosCardapioDigital();
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
    return item.preco + addonsTotal;
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
          <Typography variant="h3" >{item.nome_produto}</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 2 }}>
        <Box
          component="img"
          src={item.url_imagem}
          alt={item.nome_produto}
          sx={{
            width: '100%',
            height: 300,
            objectFit: 'contain',
            borderRadius: 5,
            mb: 2,
          }}
        />


      <Typography variant="subtitle1" color="text.secondary" gutterBottom  >
          {item.description}
        </Typography>

        <Typography variant="h6" color="success" gutterBottom>
         Preço: R$ {item.preco.toFixed(2) } 
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
                    color="primary"
                    size="large"
                    
                    sx={{
                      '&.Mui-checked': {
                        color: 'primary.main',
                      },
                      '&.Mui-checked:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.08)',
                      },
                      '&.Mui-checked:focus': {
                        backgroundColor: 'rgba(0, 0, 0, 0.08)',
                      },
                      '&.Mui-checked:active': {
                        backgroundColor: 'rgba(0, 0, 0, 0.08)',
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body1" color="green" style={{ fontSize: '18px' }}>
                    {`${adicional.nome_adicional} + R$ ${adicional.preco.toFixed(2)}`}
                  </Typography>
                }
              />
            ))}
          </Paper>
        )}


        <Box sx={{ mt: 2 }}>
          <TextField
            id="observacoes"
            label="Observações do pedido"
            multiline
            rows={3}
            fullWidth
            sx={{ mb: 2 }}
            variant="outlined"
          />
        </Box>

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