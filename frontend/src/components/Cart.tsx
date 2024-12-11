import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Cart() {
  const { total, itemCount } = useCart();
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t">
      <div className="max-w-md mx-auto">
        <Button
          className="w-full cart-button text-white py-6 rounded-full"
          disabled={itemCount === 0}
          onClick={() => navigate('/cart')}
        >
          <ShoppingCart className="mr-2" />
          VER CARRINHO
          <span className="ml-2">
            {itemCount > 0 && `(${itemCount} ${itemCount === 1 ? 'item' : 'itens'})`}
          </span>
          <span className="ml-2">R$ {total.toFixed(2)}</span>
        </Button>
      </div>
    </div>
  );
}