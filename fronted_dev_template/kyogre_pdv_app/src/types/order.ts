export interface OrderItem {
  quantidade: number;
  nome: string;
  preco: number;
}

export interface Order {
  id_pedido: number;
  data: string;
  nome: string;
  telefone: string;
  endereco: string;
  complemento: string;
  formaPagamento: string;
  status: string;
  pedido: OrderItem[];
  totalPagar: number;
}