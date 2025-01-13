import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { products } from "../data/menuData";
import { useCart } from "../contexts/CartContext"; // Assuming useCart is exported from CartContext

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="p-4">
        <Button variant="contained" onClick={() => navigate(-1)} startIcon={<ChevronLeft />}>
          Voltar
        </Button>
        <Typography variant="body1" align="center">
          Produto não encontrado
        </Typography>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="p-4">
        <Button variant="contained" onClick={() => navigate(-1)} startIcon={<ChevronLeft />}>
          Voltar
        </Button>
      </div>

      <div className="flex-1 px-4 max-w-md mx-auto w-full">
        <Card>
          <CardMedia
            component="img"
            height="240"
            image={typeof product.image === 'string' ? product.image : ''}
            alt={product.name}
          />
          <CardContent>
            <Typography variant="h5" component="div">
              {product.name}
            </Typography>
            <Typography variant="h6" color="green">
              R$ {product.price.toFixed(2)} Reais
            </Typography>
            {product.description && (
              <Typography variant="body2" color="textSecondary">
                {product.description}
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => {
                addToCart(product);
                navigate(-1);
              }}
            >
              Adicionar ao Carrinho
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetail;