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
  Box,
} from '@mui/material';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem } from '../../types/menu';
import PedidoController from '../../../app/app_garcom_pdv/controllers/PedidoController';

interface CartDialogProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onRemoveItem: (itemId: number) => void;
}

export const CartDialog: React.FC<CartDialogProps> = ({
  open,
  onClose,
  items,
  total,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const pedidoController = PedidoController.getInstance();

  const EnviarPedidoGroundonBot = () => {
    const now = new Date();
    const dataPedido = {
      data: `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`,
      hora: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
    };

    const carrinho = items.map(item => ({
      quantidade: item.quantity,
      nome: item.name,
      preco: item.price,
    }));

    const calculateTotal = () => {
      return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const newPedido = pedidoController.criarPedidoGroundon({
      id: Math.floor(Math.random() * 9000) + 1000,
      nome_cliente: "nome do cliente ",
      complemento: `complemento do endereço com rua e numero`,
      endereco: "endereço do cliente",
      total_pagar: calculateTotal(),
      data_pedido: dataPedido,
      carrinho: carrinho,
    });
    console.log("Novo Pedido enviando para o Groundon:", newPedido);

    // Enviar mensagem no WhatsApp
    const texto_pedido = `Aqui estão os detalhes do meu pedido: ${JSON.stringify(newPedido, null, 2)}`;
    const url_whatsapp = `https://api.whatsapp.com/send/?phone=5521999289987&text=${encodeURIComponent(texto_pedido)}`;
    window.open(url_whatsapp, '_blank');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        fontSize={{ xs: '1.8rem', sm: '2rem' }}
        sx={{ textAlign: 'center' }}
      >
        🛒 Seu Carrinho
      </DialogTitle>
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
              <img
                src={item.imageUrl || ''}
                alt={item.name}
                style={{ width: 50, height: 50, borderRadius: '50%', marginRight: 16 }}
              />

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
          <Typography variant="h6" align="center" sx={{ mt: 2 }}>
            Total: R$ {total.toFixed(2)}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
        {items.length > 0 && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              EnviarPedidoGroundonBot();
              onClose();
            }}
          >
            Finalizar Pedido
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};