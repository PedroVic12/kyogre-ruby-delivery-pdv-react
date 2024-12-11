import { useCart } from "../contexts/CartContext";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "../components/ui/scroll-area";
import CustomButton from "../components/ui/button"; // Import your custom button

export default function CartPage() {
  const { items, total, itemCount, incrementQuantity, decrementQuantity } = useCart();
  const navigate = useNavigate();

  console.log("Cart items:", items);
  console.log("Total:", total);

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="menu-header text-white p-4 flex items-center gap-4">
        <CustomButton 
          variant="contained" // Use a suitable variant
          onClick={() => navigate(-1)}
          className="text-white hover:text-white/80"
        >
          <ArrowLeft className="h-6 w-6" />
        </CustomButton>
        <h1 className="text-xl font-bold">CARRINHO</h1>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="max-w-md mx-auto space-y-4 py-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg p-4 flex items-center gap-4 card-shadow"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-green-500">R$ {(item.price * item.quantity).toFixed(2)}</p>
                <div className="text-sm text-gray-500">
                  Observações
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CustomButton
                  variant="outlined" // Use a suitable variant
                  size="small" // Adjust size if needed
                  className="rounded-full h-8 w-8"
                  onClick={() => {
                    if (typeof item.id === 'string') {
                      decrementQuantity(item.id);
                    } else {
                      console.error("item.id is not a valid string:", item.id);
                    }
                  }}
                >
                  <Minus className="h-4 w-4" />
                </CustomButton>
                <span className="w-8 text-center">{item.quantity}</span>
                <CustomButton
                  variant="outlined" // Use a suitable variant
                  size="small" // Adjust size if needed
                  className="rounded-full h-8 w-8"
                  onClick={() => {
                    if (typeof item.id === 'string') {
                      incrementQuantity(item.id);
                    } else {
                      console.error("item.id is not a valid string:", item.id);
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </CustomButton>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t bg-gradient-to-b from-gray-50 to-gray-100 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold">
              Total ({itemCount} {itemCount === 1 ? 'item' : 'itens'})
            </span>
            <span className="font-bold">R$ {total.toFixed(2)}</span>
          </div>
          <CustomButton
            className="w-full cart-button text-white py-6 rounded-full"
            onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
          >
            Continuar o Pedido no WhatsApp
          </CustomButton>
        </div>
      </div>
    </div>
  );
}