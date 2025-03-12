// src/hooks/useCart.ts
import { useState, useCallback } from 'react';
import { Product } from '../types/menu'; // Import the Product type

interface CartItem extends Product { // CartItem now extends Product
  quantity: number;
}

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((menuItem: Product) => { // Expecting Product interface
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
        ...menuItem, // Spread all properties from menuItem (which is Product)
        quantity: 1
      }];
    });
  }, []);

  const removeFromCart = useCallback((itemId: number) => { // itemId should be number to match Product.id
    setItems(currentItems =>
      currentItems.filter(item => item.id !== itemId)
    );
  }, []);

  const updateQuantity = useCallback((itemId: number, quantity: number) => { // itemId should be number
    if (quantity < 1) return;

    setItems(currentItems =>
      currentItems.map(item =>
        item.id === itemId
          ? { ...item, quantity }
          : item
      )
    );
  }, []);

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0); // Use item.preco
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