export interface MenuItem {
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