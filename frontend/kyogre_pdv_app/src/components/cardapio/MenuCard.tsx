import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { Product } from '../../types/menu'; // Import Product instead of MenuItem
import {   grey, indigo, } from '@mui/material/colors';

interface MenuCardProps {
  item: Product; // Change type to Product
  onAddToCart: (item: Product) => void; // Change type to Product
  onClick: () => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({ item, onAddToCart, onClick }) => {
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(item);
  };

  return (
    <Card
      sx={{
        mb: 3,
        display: 'flex',
        bgcolor: 'transparent',
        alignItems: 'center',
        border: `1px solid ${grey[300]}`,
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 10
        }
      }}
      onClick={onClick}
    >
      <CardMedia
        component="img"
        sx={{ width: 120, height: 120, objectFit: 'contain',  }}
        image={item.url_imagem || ""} // Use url_imagem and provide a default empty string
        alt={item.nome_produto}
      />
      <CardContent sx={{ flex: 1, backgroundColor: indigo[100], borderRadius: 1  }}>
        <Typography variant="h6" component="div">
          {item.nome_produto}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          {item.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>

          <Typography variant="h6"color="success">
            R$ {item.preco.toFixed(2)}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddToCart}
          >
            Adicionar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
