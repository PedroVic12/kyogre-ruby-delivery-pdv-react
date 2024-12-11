import { Product } from "@/types/menu";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking the add button
    addToCart(product);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-[#333333] rounded-lg p-4 mb-4 flex items-center justify-between card-shadow cursor-pointer hover:bg-[#444444] transition-colors"
    >
      <div className="flex items-center gap-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div>
          <h3 className="font-semibold text-lg text-white">{product.name}</h3>
          <p className="text-green-500">R$ {product.price.toFixed(2)} Reais</p>
        </div>
      </div>
      <Button
        onClick={handleAddToCart}
        className="rounded-full w-12 h-12 bg-primary hover:bg-primary/90"
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  );
}