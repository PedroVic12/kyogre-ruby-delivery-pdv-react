import React, { createContext, useContext, ReactNode } from 'react';
import { useCart as useCartHook } from '../hooks/useCart';
import { CartItem } from '../types/CartItem';
import { MenuItem } from '../types/MenuItem';

interface CartContextType {
  items: CartItem[];
  total: number;
  itemCount: number;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
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