export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  description?: string;
  isAvailable: boolean;
}

export interface Category {
  id: string;
  name: string;
  products: Product[];
}