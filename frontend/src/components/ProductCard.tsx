import { Product } from "@/types/menu";
import { useCart } from "@/contexts/CartContext";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import CustonButton from "./ui/button";

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
    src={product.imageUrl || ''}

        alt={product.name}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div>
          <h3 className="font-semibold text-lg text-white">{product.name}</h3>
          <p className="text-green-500">R$ {typeof product.price === 'number' && !isNaN(product.price) ? product.price.toFixed(2) : 'N/A'} Reais</p>
        </div>
      </div>

      <CustonButton 
        variant="contained" // Use a suitable variant
        onClick={() => navigate(`/product/${product.id}`)}
        className="text-white hover:text-white/80"
      >
        <Plus className="h-6 w-6" />
      </CustonButton>
      <Button
        onClick={handleAddToCart}
        className="rounded-full w-12 h-12 bg-primary hover:bg-primary/90"
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  );
}