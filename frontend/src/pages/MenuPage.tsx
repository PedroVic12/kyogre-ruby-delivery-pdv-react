import React from 'react';
import { MenuCategory } from '../components/menu/MenuCategory';
import { AddProductModal } from '../components/menu/AddProductModal';
import { useMenuState } from '../hooks/useMenuState';

export function MenuPage() {
  const { 
    categories,
    isModalOpen,
    setIsModalOpen,
    handleAddProduct,
    handleDeleteProduct 
  } = useMenuState();


  // api.js
 const createProduct = async (name, price, imagePath) => {
  const response = await fetch("http://localhost:8000/products/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      price,
      image_path: imagePath,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create product");
  }

  const data = await response.json();
  return data;
};

  const handleSubmit = async () => {
    try {
      const name = "New Product";
      const price = 100;
      const imagePath = "https://example.com/image.jpg"; // Replace with your image URL

      const result = await createProduct(name, price, imagePath);
      console.log(result);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };


  return (
    <div className="ml-64 pt-16 p-6">
      <div className="flex justify-between items-center mb-6">

      <button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Adicionar Produto
      </button>
        <h1 className="text-2xl font-bold text-gray-900">Gerenciar Cardápio</h1>

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

      <div>
      <h1>Product Creation</h1>
      <button onClick={handleSubmit}>Create Product</button>
    </div>


      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddProduct}
      />
    </div>
  );
}