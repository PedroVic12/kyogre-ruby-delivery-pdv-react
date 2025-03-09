import { Trash } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Category } from '../../types/menu';

type CategoryName = 'Hamburguer' | 'Pizza' | 'Sucos' | 'Salgados';

const categoryColors: Record<CategoryName, string> = {
  'Hamburguer': 'bg-blue-50 border-blue-200',
  'Pizza': 'bg-green-50 border-green-200',
  'Sucos': 'bg-yellow-50 border-yellow-200',
  'Salgados': 'bg-red-50 border-red-200'
};


interface MenuCategoryProps {
  category: Category;
  onDeleteProduct: (categoryId: string, productId: string) => void;
  onDeleteCategory: (categoryId: string) => void; // Adicione prop para deletar categoria
  onEditProduct: (productId: string) => void; // Adicione prop para editar produto
}

export function MenuCategory({ category, onDeleteProduct, onDeleteCategory }: MenuCategoryProps) { // Adicione onDeleteCategory nas props
  const colorClass = categoryColors[category.name as CategoryName] || 'bg-gray-50 border-gray-200';

  function onEditProduct(id: string, id1: string): void {
    console.log('Editar produto', id, id1);
  }

  return (
    <div className={`rounded-xl shadow-md overflow-hidden border ${colorClass} **w-full md:w-auto**`}> {/* Ajuste largura para responsividade */}
      <div className={`**p86** border-b flex justify-between items-center **text-xl**`}> {/* Aumente padding e tamanho da fonte */}
        <h2 className="**text-xl** font-semibold text-gray-900">{category.name}</h2> {/* Mantenha ou ajuste o tamanho do título */}
        <div className="flex items-center gap-2">
          <button
            className="p-2 hover:bg-white/50 rounded-full transition-colors"
            onClick={() => onDeleteCategory(category.id)} // Botão para deletar categoria
            aria-label={`Deletar categoria ${category.name}`} // Adicione aria-label para acessibilidade
          >
            <Trash className="h-5 w-5 text-gray-600" /> {/* Ícone de lixeira para deletar */}
          </button>
        </div>
      </div>

      <div className="**p-6** space-y-6"> {/* Aumente o padding da lista de produtos */}
        {category.products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            categoryColor={colorClass}
            onDelete={() => onDeleteProduct(category.id, product.id)}
            onEdit={() => onEditProduct(category.id, product.id)}
          />
        ))}
      </div>
    </div>
  );
}