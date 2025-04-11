// PedidoStateManager.ts
// Serviço centralizado para gerenciar os pedidos através do localStorage

export interface CartItem {
    id: number;
    nome_produto: string;
    preco: number;
    quantity: number;
    // Outros campos conforme necessário
  }
  
  export interface Pedido {
    id: string;
    nome_cliente: string;
    complemento: string;
    total_pagar: number;
    data_pedido: {
      data: string;
      hora: string;
    };
    carrinho: Array<{
      quantidade: number;
      nome: string;
      preco: number;
    }>;
    status?: 'pendente' | 'em_preparo' | 'pronto' | 'entregue';
  }
  
  export interface PedidoStateEvent {
    type: 'add' | 'update' | 'remove' | 'clear';
    payload: Pedido | Pedido[] | string; // id do pedido no caso de 'remove'
  }
  
  export class PedidoStateManager {
    private static instance: PedidoStateManager;
    private listeners: Array<(event: PedidoStateEvent) => void> = [];
    private readonly storageKey = 'pedidos';
  
    private constructor() {
      // Inicializa os event listeners para o storage
      window.addEventListener('storage', this.handleStorageChange);
    }
  
    public static getInstance(): PedidoStateManager {
      if (!PedidoStateManager.instance) {
        PedidoStateManager.instance = new PedidoStateManager();
      }
      return PedidoStateManager.instance;
    }
  
    // Métodos seguros para localStorage
    private safeGetItem(key: string): string | null {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.error('Failed to access localStorage:', e);
        return null;
      }
    }
  
    private safeSetItem(key: string, value: string): boolean {
      try {
        localStorage.setItem(key, value);
        return true;
      } catch (e) {
        console.error('Failed to write to localStorage:', e);
        return false;
      }
    }
  
    // Carrega os pedidos do localStorage
    public loadPedidos(): Pedido[] {
      const storedPedidos = this.safeGetItem(this.storageKey);
      return storedPedidos ? JSON.parse(storedPedidos) : [];
    }
  
    // Salva todos os pedidos no localStorage
    private savePedidos(pedidos: Pedido[]): void {
      this.safeSetItem(this.storageKey, JSON.stringify(pedidos));
    }
  
    // Cria um novo pedido
    public createPedido(pedidoData: Omit<Pedido, 'id'>): Pedido {
      const pedidos = this.loadPedidos();
      const newPedido: Pedido = {
        ...pedidoData,
        id: this.generateId()
      };
      
      pedidos.push(newPedido);
      this.savePedidos(pedidos);
      this.notifyListeners({ type: 'add', payload: newPedido });
      
      return newPedido;
    }
  
    // Atualiza um pedido existente
    public updatePedido(pedido: Pedido): void {
      const pedidos = this.loadPedidos();
      const index = pedidos.findIndex(p => p.id === pedido.id);
      
      if (index !== -1) {
        pedidos[index] = pedido;
        this.savePedidos(pedidos);
        this.notifyListeners({ type: 'update', payload: pedido });
      }
    }
  
    // Remove um pedido
    public removePedido(pedidoId: string): void {
      const pedidos = this.loadPedidos();
      const filteredPedidos = pedidos.filter(p => p.id !== pedidoId);
      
      this.savePedidos(filteredPedidos);
      this.notifyListeners({ type: 'remove', payload: pedidoId });
    }
  
    // Limpa todos os pedidos
    public clearPedidos(): void {
      this.savePedidos([]);
      this.notifyListeners({ type: 'clear', payload: [] });
    }
  
    // Gera um ID único para o pedido
    private generateId(): string {
      return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
  
    // Subscribe para mudanças no estado
    public subscribe(callback: (event: PedidoStateEvent) => void): () => void {
      this.listeners.push(callback);
      return () => {
        this.listeners = this.listeners.filter(listener => listener !== callback);
      };
    }
  
    // Notifica os listeners de mudanças
    private notifyListeners(event: PedidoStateEvent): void {
      this.listeners.forEach(listener => listener(event));
    }
  
    // Handler para eventos de storage (para sincronização entre abas)
    private handleStorageChange = (event: StorageEvent): void => {
      if (event.key === this.storageKey && event.newValue) {
        try {
          const updatedPedidos = JSON.parse(event.newValue) as Pedido[];
          this.notifyListeners({ type: 'update', payload: updatedPedidos });
        } catch (e) {
          console.error('Error parsing storage data:', e);
        }
      }
    };
  
    // Cleanup ao desmontar
    public destroy(): void {
      window.removeEventListener('storage', this.handleStorageChange);
    }
  }
  
  export default PedidoStateManager;