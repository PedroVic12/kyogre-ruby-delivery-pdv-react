// src/components/cardapio/CartDialog.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem } from '../../types/menu';

interface CartDialogProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onUpdateQuantity: (itemId: number, quantity: number) => void; // Changed itemId to number
  onRemoveItem: (itemId: number) => void; // Changed itemId to number
}

export const CartDialog: React.FC<CartDialogProps> = ({
  open,
  onClose,
  items,
  total,
  onUpdateQuantity,
  onRemoveItem
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Seu Carrinho</DialogTitle>
      <DialogContent>
        <List>
          {items.map((item) => (
            <ListItem
              key={item.id}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => onRemoveItem(item.id)}
                >
                  <Trash2 size={20} />
                </IconButton>
              }
            >
              <ListItemText
                primary={item.name}
                secondary={`R$ ${(item.price * item.quantity).toFixed(2)}`}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                <IconButton
                  size="small"
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                >
                  <Minus size={16} />
                </IconButton>
                <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                <IconButton
                  size="small"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus size={16} />
                </IconButton>
              </Box>
            </ListItem>
          ))}
        </List>
        {items.length === 0 && (
          <Typography variant="body1" sx={{ textAlign: 'center', my: 3 }}>
            Seu carrinho está vazio
          </Typography>
        )}
        {items.length > 0 && (
          <Typography variant="h6" sx={{ mt: 2 }}>
            Total: R$ {total.toFixed(2)}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
        {items.length > 0 && (
          <Button variant="contained" color="primary">
            Finalizar Pedido
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
