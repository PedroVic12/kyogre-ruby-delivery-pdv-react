import { MenuItem } from '../types/MenuItem';

export const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Classic Cheeseburger',
    price: 24.90,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
    category: 'Burgers',
    description: 'Um suculento hambúrguer com queijo cheddar derretido, alface, tomate, cebola e picles',
    addons: [
      { id: 'extra-cheese', name: 'Extra Cheese', price: 3.50 },
      { id: 'bacon', name: 'Bacon', price: 4.90 },
      { id: 'avocado', name: 'Avocado', price: 3.90 },
    ]
  },
  // ... other menu items
];