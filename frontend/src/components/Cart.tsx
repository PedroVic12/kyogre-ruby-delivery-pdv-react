import { useCart } from "../contexts/CartContext";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CustomButton from "./ui/button";

export function Cart() {
  const { total, itemCount } = useCart();
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t">
      <div className="max-w-md mx-auto">

        <CustomButton 
          variant="contained" // Use a suitable variant
          onClick={() => navigate('/cart')}
          className="text-white hover:text-white/80"
        >
          <ShoppingCart className="mr-2" />
          VER CARRINHO
          <span className="ml-2">
            {itemCount > 0 && `(${itemCount} ${itemCount === 1 ? 'item' : 'itens'})`}
          </span>
          <span className="ml-2">R$ {total.toFixed(2)}</span>
          
              </CustomButton>
      </div>
    </div>
  );
}