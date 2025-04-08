import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { Product } from '../types/menu';

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  total: number;
  itemCount: number;
  addToCart: (menuItem: Product & { adicionais?: any[]; price: number }) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((menuItem: Product & { adicionais?: any[]; price: number }) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item =>
        item.id === menuItem.id &&
        JSON.stringify(item.adicionais) === JSON.stringify(menuItem.adicionais)
      );

      if (existingItem) {
        return currentItems.map(item =>
          item.id === menuItem.id &&
          JSON.stringify(item.adicionais) === JSON.stringify(menuItem.adicionais)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentItems, { ...menuItem, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((itemId: number) => {
    setItems(currentItems =>
      currentItems.filter(item => item.id !== itemId)
    );
  }, []);

  const updateQuantity = useCallback((itemId: number, quantity: number) => {
    if (quantity < 1) return;

    setItems(currentItems =>
      currentItems.map(item =>
        item.id === itemId
          ? { ...item, quantity }
          : item
      )
    );
  }, []);

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, total, itemCount, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};