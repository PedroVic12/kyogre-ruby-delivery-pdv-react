import { useState } from 'react';
import { Category } from '../types/menu';
import { createProduct, updateCategoryProducts } from '../utils/menu';

const initialCategories: Category[] = [
  {
    id: '1',
    name: 'Hamburguer',
    products: [
      {
        id: '1',
        name: 'Big Mac',
        price: 40.99,
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500',
        description: 'Delicioso hambúrguer com dois andares',
        isAvailable: true
      }
    ]
  },
  {
    id: '2',
    name: 'Pizza',
    products: []
  },
  {
    id: '3',
    name: 'Sucos',
    products: []
  },
  {
    id: '4',
    name: 'Salgados',
    products: []
  }
];

export function useMenuState() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddProduct = (formData: any) => {
    const newProduct = createProduct(formData);
    setCategories(
      updateCategoryProducts(categories, formData.category, (products) => [...products, newProduct])
    );
  };

  const handleDeleteProduct = (categoryId: string, productId: string) => {
    setCategories(
      updateCategoryProducts(categories, categoryId, (products) =>
        products.filter(product => product.id !== productId)
      )
    );
  };

  return {
    categories,
    isModalOpen,
    setIsModalOpen,
    handleAddProduct,
    handleDeleteProduct
  };
}