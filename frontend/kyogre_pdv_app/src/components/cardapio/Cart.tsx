import React from 'react';
import { Box, Button, Typography, Badge } from '@mui/material';
import { ShoppingCart } from 'lucide-react';

interface CartProps {
  total: number;
  itemCount: number;
  onViewCart: () => void;
}

export const Cart: React.FC<CartProps> = ({ total, itemCount, onViewCart }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: 'white',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
        p: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Typography variant="subtitle1">
        Total: R$ {total.toFixed(2)}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={onViewCart}
        startIcon={
          <Badge badgeContent={itemCount} color="error">
            <ShoppingCart />
          </Badge>
        }
      >
        Ver Carrinho
      </Button>
    </Box>
  );
};