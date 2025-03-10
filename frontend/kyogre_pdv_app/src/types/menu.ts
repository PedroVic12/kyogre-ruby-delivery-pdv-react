export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  description?: string;
  isAvailable: boolean;
  adicionais?: {
    nome_adicional: string;
    preco: number;
  };
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