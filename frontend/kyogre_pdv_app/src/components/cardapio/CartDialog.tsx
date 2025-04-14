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
      nome: item.nome_produto,
      preco: item.preco,
      total: (item.preco * item.quantity).toFixed(2),
    }));
  
    const calculateTotal = () => {
      return items.reduce((total, item) => total + (item.preco * item.quantity), 0).toFixed(2);
    };
  
    const newPedido = {
      id: pedidoId, // Usando o pedidoId recebido como prop
      nome_cliente: "🧑‍💼 substituir pelo nome do Cliente",
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
    const url_whatsapp = `https://api.whatsapp.com/send/?phone=${numeroGroundon}&text=${encodeURIComponent(texto_pedido)}`;
    //const url_whatsapp = `https://wa.me/send/?phone=${numeroGroundon}&text=${encodeURIComponent(texto_pedido)}`;

    window.open(url_whatsapp, '_blank');
  };


  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
  <DialogTitle
    fontSize={{ xs: '1.8rem', sm: '1.5rem' }}
    sx={{ textAlign: 'center' }}
  >
    🛒 Seu Carrinho
  </DialogTitle>
  <hr
    style={{
      border: '2px solid #ccc',
      margin: '0 8px',
    }}
  />
  <DialogContent>
    <List>
      {items.map((item) => (
        <ListItem
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '4px 0',
            borderBottom: '2px solid #ccc',
          }}
          key={item.id}
          

          //! BOTAO DE DELETAR VERMELHO OCUPANDO MUITO ESPAÇO NO DIALOG
          // secondaryAction={
          //   <IconButton
          //     edge="end"
          //     aria-label="delete"
          //     onClick={() => onRemoveItem(item.id)}
          //     sx={{
          //       color: 'red',
          //       '&:hover': {
          //         backgroundColor: 'rgba(255, 0, 0, 0.1)',
          //       },
          //       marginLeft: '8px', // Adiciona espaçamento
          //     }}
          //   >
          //     <Trash2 size={16} />
          //   </IconButton>
          // }
        >
          <img
            src={item.url_imagem || ''}
            alt={item.nome_produto}
            style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              objectFit: 'fill',
              marginRight: '5px',
            }}
          />

          <ListItemText
            primary={item.nome_produto}
            primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 'bold' }}
            secondary={`R$ ${(item.preco * item.quantity).toFixed(2)}`}
            secondaryTypographyProps={{ fontSize: '0.7rem', color: 'success' }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            <IconButton
              size="medium"
              color="primary"
              onClick={() => {
                if (item.quantity - 1 === 0) {
                  // Remove o item se a quantidade for 0
                  onRemoveItem(item.id);
                } else {
                  // Atualiza a quantidade normalmente
                  onUpdateQuantity(item.id, item.quantity - 1);
                }
              }}
              sx={{
                color: 'slateblue',
                '&:hover': {
                  backgroundColor: 'rgba(255, 0, 0, 0.1)',
                },
                marginRight: '4px', // Adiciona espaçamento
              }}
            >
              <Minus size={18} />
            </IconButton>
            <Typography sx={{ mx: 1 }} variant="h6">
              {item.quantity}
            </Typography>
            <IconButton
              size="medium"
              color="success"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              sx={{
                marginLeft: '4px', // Adiciona espaçamento
              }}
            >
              <Plus size={18} />
            </IconButton>
          </Box>
        </ListItem>
      ))}
    </List>

    {items.length === 0 && (
      <Typography variant="h2" sx={{ textAlign: 'center', my: 3 }}>
        Seu carrinho está vazio
      </Typography>
    )}
    {items.length > 0 && (
      <Typography
        variant="h5"
        align="center"
        sx={{ mt: 2, fontWeight: 'bold' }}
      >
        <span role="img" aria-label="money">
          💰
        </span>{' '}
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