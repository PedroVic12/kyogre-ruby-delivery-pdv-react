// CartStateManager.ts
// Serviço centralizado para gerenciar carrinhos por pessoa/mesa

import { CartItem } from './PedidoStateManager';

export interface Person {
  id: string;
  name: string;
}

export interface CartStateEvent {
  type: 'update' | 'add_item' | 'remove_item' | 'clear';
  personId: string;
  payload?: any; // Depende do tipo de evento
}

export class CartStateManager {
  private static instance: CartStateManager;
  private listeners: Array<(event: CartStateEvent) => void> = [];
  private readonly storageKey = 'carts_by_person';

  private constructor() {
    // Inicializa os event listeners para o storage
    window.addEventListener('storage', this.handleStorageChange);
  }

  public static getInstance(): CartStateManager {
    if (!CartStateManager.instance) {
      CartStateManager.instance = new CartStateManager();
    }
    return CartStateManager.instance;
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

  // Carrega todos os carrinhos do localStorage
  public loadCarts(): Record<string, CartItem[]> {
    const storedCarts = this.safeGetItem(this.storageKey);
    return storedCarts ? JSON.parse(storedCarts) : { mesa: [] };
  }

  // Salva todos os carrinhos no localStorage
  private saveCarts(carts: Record<string, CartItem[]>): void {
    this.safeSetItem(this.storageKey, JSON.stringify(carts));
  }

  // Carrega o carrinho específico de uma pessoa
  public loadCartForPerson(personId: string): CartItem[] {
    const carts = this.loadCarts();
    return carts[personId] || [];
  }

  // Adiciona ou atualiza item no carrinho de uma pessoa
  public addToCart(personId: string, item: CartItem): void {
    const carts = this.loadCarts();
    const personCart = carts[personId] || [];
    
    const existingItemIndex = personCart.findIndex(i => i.id === item.id);
    
    if (existingItemIndex !== -1) {
      // Item já existe, atualiza a quantidade
      personCart[existingItemIndex] = {
        ...personCart[existingItemIndex],
        quantity: personCart[existingItemIndex].quantity + item.quantity
      };
    } else {
      // Novo item
      personCart.push(item);
    }
    
    carts[personId] = personCart;
    this.saveCarts(carts);
    
    this.notifyListeners({ 
      type: 'add_item', 
      personId, 
      payload: item 
    });
  }

  // Remove um item do carrinho
  public removeFromCart(personId: string, itemId: number): void {
    const carts = this.loadCarts();
    const personCart = carts[personId] || [];
    
    const existingItemIndex = personCart.findIndex(i => i.id === itemId);
    
    if (existingItemIndex !== -1) {
      const currentItem = personCart[existingItemIndex];
      
      if (currentItem.quantity > 1) {
        // Reduz a quantidade
        personCart[existingItemIndex] = {
          ...currentItem,
          quantity: currentItem.quantity - 1
        };
      } else {
        // Remove o item completamente
        personCart.splice(existingItemIndex, 1);
      }
      
      carts[personId] = personCart;
      this.saveCarts(carts);
      
      this.notifyListeners({
        type: 'remove_item',
        personId,
        payload: itemId
      });
    }
  }

  // Limpa o carrinho de uma pessoa
  public clearCart(personId: string): void {
    const carts = this.loadCarts();
    carts[personId] = [];
    this.saveCarts(carts);
    
    this.notifyListeners({
      type: 'clear',
      personId
    });
  }

  // Atualiza o carrinho completo de uma pessoa
  public updatePersonCart(personId: string, cart: CartItem[]): void {
    const carts = this.loadCarts();
    carts[personId] = cart;
    this.saveCarts(carts);
    
    this.notifyListeners({
      type: 'update',
      personId,
      payload: cart
    });
  }

  // Calcula o total de itens de um carrinho
  public getCartTotal(personId: string): number {
    const cart = this.loadCartForPerson(personId);
    return cart.reduce((total, item) => total + (item.preco * item.quantity), 0);
  }

  // Calcula o número total de itens em um carrinho
  public getCartItemCount(personId: string): number {
    const cart = this.loadCartForPerson(personId);
    return cart.reduce((count, item) => count + item.quantity, 0);
  }

  // Subscribe para mudanças no estado
  public subscribe(callback: (event: CartStateEvent) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Notifica os listeners de mudanças
  private notifyListeners(event: CartStateEvent): void {
    this.listeners.forEach(listener => listener(event));
  }

  // Handler para eventos de storage (para sincronização entre abas)
  private handleStorageChange = (event: StorageEvent): void => {
    if (event.key === this.storageKey && event.newValue) {
      try {
        const updatedCarts = JSON.parse(event.newValue) as Record<string, CartItem[]>;
        
        // Notifica sobre a atualização de cada carrinho
        Object.keys(updatedCarts).forEach(personId => {
          this.notifyListeners({
            type: 'update',
            personId,
            payload: updatedCarts[personId]
          });
        });
      } catch (e) {
        console.error('Error parsing storage data:', e);
      }
    }
  };

  // Gera ID aleatório para uma nova pessoa
  public generateRandomId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  // Cleanup ao desmontar
  public destroy(): void {
    window.removeEventListener('storage', this.handleStorageChange);
  }
}

export default CartStateManager;