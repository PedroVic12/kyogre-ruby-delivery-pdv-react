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
        mb: 2,
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 6
        }
      }}
      onClick={onClick}
    >
      <CardMedia
        component="img"
        sx={{ width: 140, height: 140, objectFit: 'cover' }}
        image={item.imageUrl || ""} // Use url_imagem and provide a default empty string
        alt={item.name}
      />
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="h6" component="div">
          {item.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {item.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="primary">
            R$ {item.price.toFixed(2)}
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
