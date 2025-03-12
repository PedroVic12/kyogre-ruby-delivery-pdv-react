import React, { createContext, useContext, ReactNode } from 'react';
import { useCart as useCartHook } from '../hooks/useCart';
import { CartItem,Product } from '../types/menu';

interface CartContextType {
  items: CartItem[];
  total: number;
  itemCount: number;
  addToCart: (menuItem: Product) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const cart = useCartHook();

  return (
    <CartContext.Provider value={cart}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};