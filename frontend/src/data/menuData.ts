import {  Product } from "@/types/menu";


export interface Category {
  id: string;
  name: string;
  icon: string;
  products: Product[];
}

export const categories: Category[] = [
  {
    id: "sandwiches",
    name: "Sanduíches",
    icon: "🥪",
    products: [
      {
        id: "1",
        name: "Americano",
        price: 24,
        image: "https://www.iugu.com/hubfs/Imported_Blog_Media/Ruby-conhe%C3%A7a-essa-linguagem-de-programa%C3%A7%C3%A3o-1.jpg",
        category: "sandwiches",
        isAvailable: false
      },
      {
        id: "2",
        name: "Bauru",
        price: 42,
        image: "https://www.iugu.com/hubfs/Imported_Blog_Media/Ruby-conhe%C3%A7a-essa-linguagem-de-programa%C3%A7%C3%A3o-1.jpg",
        category: "sandwiches",
        isAvailable: false
      },
      {
        id: "3",
        name: "Filé de Carne",
        price: 30,
        image: "https://www.iugu.com/hubfs/Imported_Blog_Media/Ruby-conhe%C3%A7a-essa-linguagem-de-programa%C3%A7%C3%A3o-1.jpg",
        category: "sandwiches",
        isAvailable: false
      },
    ],
  },
  {
    id: "salgados",
    name: "Salgados",
    icon: "🥟",
    products: [
      {
        id: "4",
        name: "Coxinha",
        price: 8,
        image: "https://www.iugu.com/hubfs/Imported_Blog_Media/Ruby-conhe%C3%A7a-essa-linguagem-de-programa%C3%A7%C3%A3o-1.jpg",
        category: "salgados",
        isAvailable: false
      },
      {
        id: "5",
        name: "Pastel",
        price: 10,
        image: "https://www.iugu.com/hubfs/Imported_Blog_Media/Ruby-conhe%C3%A7a-essa-linguagem-de-programa%C3%A7%C3%A3o-1.jpg",
        category: "salgados",
        isAvailable: false
      },
      {
        id: "6",
        name: "Kibe",
        price: 7,
        image: "https://www.iugu.com/hubfs/Imported_Blog_Media/Ruby-conhe%C3%A7a-essa-linguagem-de-programa%C3%A7%C3%A3o-1.jpg",
        category: "salgados",
        isAvailable: false
      },
    ],
  },
  {
    id: "acai",
    name: "Açaí e Pitaya",
    icon: "🍇",
    products: [
      {
        id: "7",
        name: "Açaí 300ml",
        price: 15,
        image: "https://www.iugu.com/hubfs/Imported_Blog_Media/Ruby-conhe%C3%A7a-essa-linguagem-de-programa%C3%A7%C3%A3o-1.jpg",
        category: "acai",
        isAvailable: false
      },
      {
        id: "8",
        name: "Açaí 500ml",
        price: 18,
        image: "https://www.iugu.com/hubfs/Imported_Blog_Media/Ruby-conhe%C3%A7a-essa-linguagem-de-programa%C3%A7%C3%A3o-1.jpg",
        category: "acai",
        isAvailable: false
      },
      {
        id: "9",
        name: "Pitaya 300ml",
        price: 17,
        image: "https://www.iugu.com/hubfs/Imported_Blog_Media/Ruby-conhe%C3%A7a-essa-linguagem-de-programa%C3%A7%C3%A3o-1.jpg",
        category: "acai",
        isAvailable: false
      },
    ],
  },
];

// New array for category images (if needed)
export const category_array_DB: string[] = [
  "https://www.iugu.com/hubfs/Imported_Blog_Media/Ruby-conhe%C3%A7a-essa-linguagem-de-programa%C3%A7%C3%A3o-1.jpg", // Image for sandwiches
  "https://www.iugu.com/hubfs/Imported_Blog_Media/Ruby-conhe%C3%A7a-essa-linguagem-de-programa%C3%A7%C3%A3o-1.jpg", // Image for salgados
  "https://www.iugu.com/hubfs/Imported_Blog_Media/Ruby-conhe%C3%A7a-essa-linguagem-de-programa%C3%A7%C3%A3o-1.jpg", // Image for açaí
];

export const products: Product[] = [];