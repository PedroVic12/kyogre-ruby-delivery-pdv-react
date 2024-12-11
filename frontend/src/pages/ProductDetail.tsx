import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { products } from "@/data/menuData";
import { useCart } from "@/contexts/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="p-4">
        <Button onClick={() => navigate(-1)} variant="ghost" className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <p className="text-center">Produto não encontrado</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="p-4">
        <Button onClick={() => navigate(-1)} variant="ghost" className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
      </div>

      <div className="flex-1 px-4 max-w-md mx-auto w-full">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        <p className="text-green-500 text-xl mb-4">
          R$ {product.price.toFixed(2)} Reais
        </p>
        {product.description && (
          <p className="text-gray-600 mb-6">{product.description}</p>
        )}
        
        <Button 
          className="w-full cart-button text-white py-6"
          onClick={() => {
            addToCart(product);
            navigate(-1);
          }}
        >
          Adicionar ao Carrinho
        </Button>
      </div>
    </div>
  );
}