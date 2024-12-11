import React from 'react';
import { Plus, Minus, MoreVertical, Edit, Trash } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Category } from '../../types/menu';

const categoryColors = {
  'Hamburguer': 'bg-blue-50 border-blue-200',
  'Pizza': 'bg-green-50 border-green-200',
  'Sucos': 'bg-yellow-200 border-yellow-200',
  'Salgados': 'bg-red-50 border-red-200'
};
// Assuming your object is something like this
const menuItems = {
  Hamburguer: "Delicious Hamburger",
  Pizza: "Cheesy Pizza",
  Sucos: "Fresh Juices",
  Salgados: "Savory Snacks",
};

// If you have a variable that is a string
const itemKey: string = "Pizza"; // This could be any string

// Use type assertion to tell TypeScript that itemKey is one of the keys
const item = menuItems[itemKey as keyof typeof menuItems];


interface MenuCategoryProps {
  category: Category;
  onDeleteProduct: (categoryId: string, productId: string) => void;
}

export function MenuCategory({ category, onDeleteProduct }: MenuCategoryProps) {
  const colorClass = categoryColors[category.name] || 'bg-gray-50 border-gray-200';

  return (
    <div className={`rounded-xl shadow-sm overflow-hidden border ${colorClass}`}>
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">{category.name}</h2>
        <div className="flex items-center gap-2">
          <button className="p-1 hover:bg-white/50 rounded-full transition-colors">
            <Plus className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-1 hover:bg-white/50 rounded-full transition-colors">
            <Minus className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {category.products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            categoryColor={colorClass}
            onDelete={() => onDeleteProduct(category.id, product.id)}
          />
        ))}
      </div>
    </div>
  );
}