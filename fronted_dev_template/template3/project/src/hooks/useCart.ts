import { useState, useCallback } from 'react';
import { MenuItem } from '../types/MenuItem';
import { CartItem } from '../types/CartItem';

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((menuItem: MenuItem) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === menuItem.id);
      
      if (existingItem) {
        return currentItems.map(item =>
          item.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...currentItems, {
        id: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 1
      }];
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setItems(currentItems => 
      currentItems.filter(item => item.id !== itemId)
    );
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
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

  return {
    items,
    total,
    itemCount,
    addToCart,
    removeFromCart,
    updateQuantity
  };
};