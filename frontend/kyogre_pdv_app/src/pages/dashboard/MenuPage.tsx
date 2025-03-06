import { MenuCategory } from '../../components/menu/MenuCategory';
import { AddProductModal } from '../../components/menu/AddProductModal';
import { useMenuState } from '../../hooks/useMenuState';

export function MenuPage() {
  const { 
    categories,
    isModalOpen,
    setIsModalOpen,
    handleAddProduct,
    handleDeleteProduct 
  } = useMenuState();

  return (
    <div className="ml-2 pt-8 p-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gerenciar Cardápio</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Adicionar Produto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <MenuCategory
            key={category.id}
            category={category}
            onDeleteProduct={handleDeleteProduct}
          />
        ))}
      </div>

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddProduct}
      />
    </div>
  );
}