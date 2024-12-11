import { Category, Product } from "@/types/menu";

export const categories: Category[] = [
  {
    id: "sandwiches",
    name: "Sanduíches",
    icon: "🥪",
  },
  {
    id: "salgados",
    name: "Salgados",
    icon: "🥟",
  },
  {
    id: "acai",
    name: "Açaí e Pitaya",
    icon: "🍇",
  },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Americano",
    price: 24,
    image: "/lovable-uploads/e9c2d9a4-45b9-4401-9882-aceb1097ac33.png",
    category: "sandwiches",
  },
  {
    id: "2",
    name: "Bauru",
    price: 42,
    image: "/lovable-uploads/e9c2d9a4-45b9-4401-9882-aceb1097ac33.png",
    category: "sandwiches",
  },
  {
    id: "3",
    name: "Filé de Carne",
    price: 30,
    image: "/lovable-uploads/e9c2d9a4-45b9-4401-9882-aceb1097ac33.png",
    category: "sandwiches",
  },
  {
    id: "4",
    name: "X-Tudo",
    price: 35,
    image: "/lovable-uploads/e9c2d9a4-45b9-4401-9882-aceb1097ac33.png",
    category: "sandwiches",
  },
  {
    id: "5",
    name: "X-Salada",
    price: 28,
    image: "/lovable-uploads/e9c2d9a4-45b9-4401-9882-aceb1097ac33.png",
    category: "sandwiches",
  },
  {
    id: "6",
    name: "Coxinha",
    price: 8,
    image: "/lovable-uploads/e9c2d9a4-45b9-4401-9882-aceb1097ac33.png",
    category: "salgados",
  },
  {
    id: "7",
    name: "Pastel",
    price: 10,
    image: "/lovable-uploads/e9c2d9a4-45b9-4401-9882-aceb1097ac33.png",
    category: "salgados",
  },
  {
    id: "8",
    name: "Kibe",
    price: 7,
    image: "/lovable-uploads/e9c2d9a4-45b9-4401-9882-aceb1097ac33.png",
    category: "salgados",
  },
  {
    id: "9",
    name: "Açaí 300ml",
    price: 15,
    image: "/lovable-uploads/e9c2d9a4-45b9-4401-9882-aceb1097ac33.png",
    category: "acai",
  },
  {
    id: "10",
    name: "Açaí 500ml",
    price: 18,
    image: "/lovable-uploads/e9c2d9a4-45b9-4401-9882-aceb1097ac33.png",
    category: "acai",
  },
  {
    id: "11",
    name: "Pitaya 300ml",
    price: 17,
    image: "/lovable-uploads/e9c2d9a4-45b9-4401-9882-aceb1097ac33.png",
    category: "acai",
  },
];