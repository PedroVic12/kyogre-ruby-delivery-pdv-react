import React, { createContext, useContext, useState } from "react";
import { CartItem as CartItemModel, Product } from "../types/menu";

interface CartContextType {
  items: CartItemModel[];
  addToCart: (product: Product) => void;
  incrementQuantity: (productId: string) => void;
  decrementQuantity: (productId: string) => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemModel[]>([]);

  const addToCart = (product: Product) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += 1; // Increment quantity directly
        return [...currentItems]; // Return the updated array
      }

      return currentItems;
      
      //const newItem = new CartItemModel(product.id, product.name, product.price, 1, product.image);
      //return [...currentItems, newItem]; // Add new item
    });
  };

  const incrementQuantity = (productId: string) => {
    if (typeof productId === "string") {
      setItems((currentItems) =>
        currentItems.map((item) =>
          item.id === productId
            ? new CartItemModel(item.id, item.name, item.price, item.quantity + 1, item.image)
            : item
        )
      );
    } else {
      console.error("productId is not a valid string:", productId);
      // Handle the case where productId is undefined or not a string
    }
  };

  const decrementQuantity = (productId: string) => {
    if (typeof productId === "string") {
      setItems((currentItems) =>
        currentItems
          .map((item) =>
            item.id === productId
              ? new CartItemModel(item.id, item.name, item.price, item.quantity - 1, item.image)
              : item
          )
          .filter((item) => item.quantity > 0)
      );
    } else {
      console.error("productId is not a valid string:", productId);
      // Handle the case where productId is undefined or not a string
    }
  };

  const total = items.reduce((sum, item) => sum + item.getTotalPrice(), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      items, 
      addToCart, 
      incrementQuantity, 
      decrementQuantity, 
      total, 
      itemCount 
    }}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use the CartContext
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}