// src/types/menu.ts
export interface Adicional {
  nome_adicional: string;
  preco: number;
}

export interface Product {
  id: number;
  nome_produto: string;
  preco: number;
  description: any;
  categoria?: string;
  isAvailable: boolean;
  adicionais?: Adicional[]; //! Changed to an array of Adicional objects
  url_imagem?: string;
  descricao?: string;
  disponivel?: boolean;
}

export interface Category {
  id: number;
  name: string;
  products: Product[];
  color: string;
}


export interface CartItem extends Product {
  quantity: number;
}

