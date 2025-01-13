export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  addons?: Addon[];
}

export interface Addon {
  id: string;
  name: string;
  price: number;
}

export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
};