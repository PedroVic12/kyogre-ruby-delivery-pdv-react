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



    const array_imagens_storage = [

      "https://www.iugu.com/hubfs/Imported_Blog_Media/Ruby-conhe%C3%A7a-essa-linguagem-de-programa%C3%A7%C3%A3o-1.jpg",

      "https://www.iugu.com/hubfs/Imported_Blog_Media/Ruby-conhe%C3%A7a-essa-linguagem-de-programa%C3%A7%C3%A3o-1.jpg",

      "https://www.iugu.com/hubfs/Imported_Blog_Media/Ruby-conhe%C3%A7a-essa-linguagem-de-programa%C3%A7%C3%A3o-1.jpg",
      "https://www.iugu.com/hubfs/Imported_Blog_Media/Ruby-conhe%C3%A7a-essa-linguagem-de-programa%C3%A7%C3%A3o-1.jpg",
      "https://www.iugu.com/hubfs/Imported_Blog_Media/Ruby-conhe%C3%A7a-essa-linguagem-de-programa%C3%A7%C3%A3o-1.jpg",
      "https://www.iugu.com/hubfs/Imported_Blog_Media/Ruby-conhe%C3%A7a-essa-linguagem-de-programa%C3%A7%C3%A3o-1.jpg",
      "https://www.iugu.com/hubfs/Imported_Blog_Media/Ruby-conhe%C3%A7a-essa-linguagem-de-programa%C3%A7%C3%A3o-1.jpg",
      "https://www.iugu.com/hubfs/Imported_Blog_Media/Ruby-conhe%C3%A7a-essa-linguagem-de-programa%C3%A7%C3%A3o-1.jpg",
      "https://www.iugu.com/hubfs/Imported_Blog_Media/Ruby-conhe%C3%A7a-essa-linguagem-de-programa%C3%A7%C3%A3o-1.jpg",
      "https://www.iugu.com/hubfs/Imported_Blog_Media/Ruby-conhe%C3%A7a-essa-linguagem-de-programa%C3%A7%C3%A3o-1.jpg",
      "https://www.iugu.com/hubfs/Imported_Blog_Media/Ruby-conhe%C3%A7a-essa-linguagem-de-programa%C3%A7%C3%A3o-1.jpg",
      "https://www.iugu.com/hubfs/Imported_Blog_Media/Ruby-conhe%C3%A7a-essa-linguagem-de-programa%C3%A7%C3%A3o-1.jpg",

    ];


  // api.js
 const createProduct = async (name: string, price: number, imagePath: string) => {
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
      // <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500" alt="Big Mac" class="w-full h-full object-cover">
      const imagePath = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500"; // Replace with your image URL

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