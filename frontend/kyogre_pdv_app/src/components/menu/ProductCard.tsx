import  { useState } from 'react';
import { MoreVertical, Edit, Trash } from 'lucide-react';
import { Product } from '../../types/menu';

interface ProductCardProps {
  product: Product;
  categoryColor: string;
  onDelete: (productId: string) => void; // Modifique onDelete para receber productId
  onEdit: (productId: string, productData: Product) => void; // Adicione prop para editar
}

export function ProductCard({ product, categoryColor, onDelete }: ProductCardProps) { // Adicione onEdit nas props
  const [showActions, setShowActions] = useState(false);

  const handleEditClick = () => {
    setShowActions(false); // Oculta o menu de ações
    alert(`Editar produto ${product.name} (ID: ${product.id}) - Funcionalidade em desenvolvimento`); // TODO: Implementar modal de edição
    // Aqui você chamaria a função onEdit, passando o ID do produto e talvez os dados atuais do produto
    // onEdit(product.id, product); // Exemplo de chamada da função onEdit
  };

  const handleDeleteClick = () => {
    setShowActions(false); // Oculta o menu de ações
    onDelete(product.id); // Chama a função onDelete passando o ID do produto
  };


  return (
    <div className={`flex items-center justify-between p-4 rounded-lg ${categoryColor}`}> {/* Aumentei o padding para p-4 */}
      <div className="flex items-center gap-4"> {/* Aumentei o gap para gap-4 */}
        <div className="w-16 h-16 bg-white rounded-lg overflow-hidden **min-w-[4rem] min-h-[3rem]**"> {/* Ajuste tamanho da imagem e min-w/h */}
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div>
          <h3 className="font-medium text-gray-900 **text-lg**">{product.name}</h3> {/* Ajuste tamanho do nome */}
          <p className="text-sm text-gray-500">R$ {product.price.toFixed(2)}</p> {/* Formate o preço para 2 casas decimais */}
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => setShowActions(!showActions)}
          className="p-2 hover:bg-white/50 rounded-full transition-colors" // Aumentei o padding para p-2
          aria-label={`Mostrar ações para ${product.name}`} // Adicione aria-label para acessibilidade
        >
          <MoreVertical className="h-5 w-5 text-gray-600" />
        </button>

        {showActions && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10"> {/* Aumentei o padding vertical para py-2 */}
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
              onClick={handleEditClick} // Adicione handler para editar
            >
              <Edit className="h-4 w-4" />
              Editar Produto
            </button>
            <button
              onClick={handleDeleteClick} // Use o novo handleDeleteClick
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600 flex items-center gap-2"
              aria-label={`Deletar produto ${product.name}`} // Adicione aria-label para acessibilidade
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