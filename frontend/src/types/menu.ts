import { ReactNode } from "react";

export interface Product {
  [x: string]: string | boolean | number | undefined; // Allow number as well
  category: string;
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  description?: string;
  isAvailable: boolean; // This will now work
}

export interface Category {
  icon: ReactNode;
  id: string;
  name: string;
  products: Product[];
}

// src/types/menu.ts
export class CartItem {
  constructor(
    public id: string,
    public name: string,
    public price: number,
    public quantity: number,
    public image: string
  ) {}

  getTotalPrice() {
    return this.price * this.quantity;
  }
}