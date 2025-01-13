import { useEffect, useState } from "react";
import { ProductCard } from "../components/ProductCard";
import { Cart } from "../components/Cart";
import { categories, Category } from "../data/menuData";
import { Product } from "@/types/menu";

export function CardapioDigitalPage() {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('http://localhost:1998/products');
      const data = await response.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);


  const handleAddToCart = (product: { name: any; }) => {
    // Add product to cart logic here
    alert(`Added ${product.name} to cart!`);
  };

  return (
    <div className="pb-24">
      <div className="menu-header text-white p-4 mb-6">
        <h1 className="text-xl font-bold mb-4 text-center">Sua Lanchonete</h1>
        
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex-shrink-0 px-6 py-3 rounded-full transition-colors ${
                activeCategory === category.id
                  ? "tab-active"
                  : "bg-white/20 text-white"
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 max-w-md mx-auto">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            {categories.find((c) => c.id === activeCategory)?.name}
          </h2>
        </div>

        { (categories.find((c) => c.id === activeCategory) as Category)?.name }
      </div>

      <Cart />
    </div>
  );
};