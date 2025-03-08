import  { useState } from 'react';
import { MoreVertical, Edit, Trash } from 'lucide-react';
import { Product } from '../../types/menu';

interface ProductCardProps {
  product: Product;
  categoryColor: string;
  onDelete: () => void;
}

export function ProductCard({ product, categoryColor, onDelete }: ProductCardProps) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg ${categoryColor}`}>
      <div className="flex items-center gap-3">
        <div className="w-20 h-12 bg-white rounded-lg overflow-hidden">
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{product.name}</h3>
          <p className="text-sm text-gray-500">R$ {product.price}</p>
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => setShowActions(!showActions)}
          className="p-1 hover:bg-white/50 rounded-full transition-colors"
        >
          <MoreVertical className="h-5 w-5 text-gray-600" />
        </button>

        {showActions && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
            <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Editar Produto
            </button>
            <button
              onClick={onDelete}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600 flex items-center gap-2"
            >
              <Trash className="h-4 w-4" />
              Deletar Produto
            </button>
          </div>
        )}
      </div>
    </div>
  );
}