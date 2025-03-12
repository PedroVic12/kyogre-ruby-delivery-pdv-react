// src/types/menu.ts
export interface Adicional {
  nome_adicional: string;
  preco: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  description: string;
  isAvailable: boolean;
  adicionais?: Adicional[]; //! Changed to an array of Adicional objects
  categoria?: string;
  url_imagem?: string;
  descricao?: string;
  disponivel?: boolean;
}

export interface Category {
  id: number;
  name: string;
  products: Product[];
}


export interface CartItem extends Product {
  quantity: number;
}

