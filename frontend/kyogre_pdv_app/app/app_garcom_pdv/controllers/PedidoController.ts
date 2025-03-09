export interface Pedido {
  id: string;
  mesa: number;
  cliente: string;
  items: {
    id: number;
    name: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  paymentMethod?: 'dinheiro' | 'debito' | 'credito' | 'picpay';
  createdAt: Date;
}

class PedidoController {
  private static instance: PedidoController;
  private pedidos: Pedido[] = [];

  private constructor() {}

  static getInstance(): PedidoController {
    if (!PedidoController.instance) {
      PedidoController.instance = new PedidoController();
    }
    return PedidoController.instance;
  }

  createPedido(pedido: Omit<Pedido, 'id' | 'status' | 'createdAt'>): Pedido {
    const newPedido: Pedido = {
      ...pedido,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      createdAt: new Date()
    };
    
    this.pedidos.push(newPedido);
    this.savePedidos();
    return newPedido;
  }

  getPedidos(): Pedido[] {
    return this.pedidos;
  }

  getPedido(id: string): Pedido | undefined {
    return this.pedidos.find(p => p.id === id);
  }

  updatePedidoStatus(id: string, status: Pedido['status']): Pedido | undefined {
    const pedido = this.pedidos.find(p => p.id === id);
    if (pedido) {
      pedido.status = status;
      this.savePedidos();
    }
    return pedido;
  }

  updatePaymentMethod(id: string, method: Pedido['paymentMethod']): Pedido | undefined {
    const pedido = this.pedidos.find(p => p.id === id);
    if (pedido) {
      pedido.paymentMethod = method;
      this.savePedidos();
    }
    return pedido;
  }

  private savePedidos(): void {
    localStorage.setItem('pedidos', JSON.stringify(this.pedidos));
  }

  loadPedidos(): void {
    const savedPedidos = localStorage.getItem('pedidos');
    if (savedPedidos) {
      this.pedidos = JSON.parse(savedPedidos);
    }
  }
}

export default PedidoController;