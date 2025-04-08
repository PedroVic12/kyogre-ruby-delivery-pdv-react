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

interface CartDialogProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onRemoveItem: (itemId: number) => void;
  pedidoId: number | null; // Estado para o ID do pedido
}

export const CartDialog: React.FC<CartDialogProps> = ({
  open,
  onClose,
  items,
  total,
  onUpdateQuantity,
  onRemoveItem,
  pedidoId, // Recebendo o pedidoId

}) => {

  const EnviarPedidoGroundonBot = () => {
    const numeroGroundon = "5521989776697"; // Número do Groundon Bot
    const now = new Date();
    const dataPedido = {
      data: `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`,
      hora: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
    };
  
    const carrinho = items.map(item => ({
      quantidade: item.quantity,
      nome: item.name,
      preco: item.price,
      total: (item.price * item.quantity).toFixed(2),
    }));
  
    const calculateTotal = () => {
      return items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };
  
    const newPedido = {
      id: pedidoId, // Usando o pedidoId recebido como prop
      nome_cliente: "🧑‍💼 substituir pelo Cliente",
      complemento: "🏠 Complemento do endereço com rua e número",
      endereco: "📍 substituir Endereço do cliente",
      total_pagar: calculateTotal(),
      data_pedido: dataPedido,
      carrinho: carrinho,
    };
  
    console.log("Novo Pedido enviando para o Groundon:", newPedido);
  
    // Formatar mensagem para WhatsApp
    let texto_pedido = `📦 *Detalhes do Pedido* ${newPedido.id} 📦\n\n`;
    texto_pedido += `🗓️ *Data*: ${dataPedido.data}\n`;
    texto_pedido += `⏰ *Hora*: ${dataPedido.hora}\n\n`;
    //texto_pedido += `👤 *Cliente*: ${newPedido.nome_cliente}\n`;
    //texto_pedido += `📍 *Endereço*: ${newPedido.endereco}\n`;
    //texto_pedido += `🏠 *Complemento*: ${newPedido.complemento}\n\n`;
    texto_pedido += `🛒 *Itens do Carrinho*:\n`;
  
    carrinho.forEach(item => {
      texto_pedido += `  - ${item.nome} | Quantidade: ${item.quantidade} | Total: R$ ${item.total}\n`;
    });
  
    texto_pedido += `\n💰 *Total a Pagar*: R$ ${newPedido.total_pagar}\n\n`;
  
    // Enviar mensagem no WhatsApp
    //const url_whatsapp = `https://api.whatsapp.com/send/?phone=${numeroGroundon}&text=${encodeURIComponent(texto_pedido)}`;
    const url_whatsapp = `https://wa.me/send/?phone=${numeroGroundon}&text=${encodeURIComponent(texto_pedido)}`;

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
      <hr 
        style={{
          border: '1px solid #ccc',
          margin: '0 16px',
        }}
      />
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
                  sx={{
                    color: 'red',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 0, 0, 0.1)',
                    },
                  }}
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
                primaryTypographyProps={{ fontSize: '1.2rem' }}
                secondary={`R$ ${(item.price * item.quantity).toFixed(2)}`}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                <IconButton
                  size="large"
                  color="primary"

                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                >
                  <Minus size={20} />
                </IconButton>
                <Typography sx={{ mx: 1 }} variant="h6">{item.quantity}</Typography>
                <IconButton
                  size="large"
                  color="success"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus size={20} />
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