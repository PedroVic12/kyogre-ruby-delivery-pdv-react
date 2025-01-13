import { Product, Category } from '../types/menu';

export function createProduct(formData: any): Product {
  return {
    id: Date.now().toString(),
    name: formData.name,
    price: Number(formData.price),
    description: formData.description,
    imageUrl: formData.imageUrl,
    isAvailable: formData.isAvailable
  };
}

export function updateCategoryProducts(
  categories: Category[],
  categoryId: string,
  updater: (products: Product[]) => Product[]
): Category[] {
  return categories.map(category => {
    if (category.id === categoryId) {
      return {
        ...category,
        products: updater(category.products)
      };
    }
    return category;
  });
}