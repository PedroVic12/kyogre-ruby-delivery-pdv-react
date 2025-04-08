import { useState, useCallback } from 'react';
import { Product } from '../types/menu';

interface CartItem extends Product {
  quantity: number;
}

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((menuItem: Product & { adicionais?: any[]; price: number }) => {
    setItems(currentItems => {
      console.log("Estado atual do carrinho:", currentItems);
      //console.log("Item sendo adicionado:", menuItem);

      const existingItem = currentItems.find(item =>
        item.id === menuItem.id &&
        JSON.stringify(item.adicionais) === JSON.stringify(menuItem.adicionais)
      );

      if (existingItem) {
        console.log("Item já existe no carrinho. Atualizando quantidade...");
        return currentItems.map(item =>
          item.id === menuItem.id &&
          JSON.stringify(item.adicionais) === JSON.stringify(menuItem.adicionais)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      console.log("Item não existe no carrinho. Adicionando novo item...");
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

  return {
    items,
    total,
    itemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
  };
};