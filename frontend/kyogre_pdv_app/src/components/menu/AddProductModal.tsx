import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Switch } from '../ui/Switch';
import BotaoLoaderMUI from '../BotaoLoaderMUI';
import { purple } from '@mui/material/colors';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: any) => void;
}

export function AddProductModal({ isOpen, onClose, }: AddProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    isAvailable: true,
    imageUrl: 'https://picsum.photos/200/300',
  });
  const [isLoading,] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const novoProduto = {
      nome_produto: formData.name, // Use 'nome_produto' to match your backend Pydantic model
      preco: parseFloat(formData.price), // Convert price to a number (float)
      categoria: formData.category,   // Use 'categoria' to match your backend Pydantic model
      url_imagem: formData.imageUrl, // Use 'url_imagem'
      descricao: formData.description, // Use 'descricao'
      disponivel: formData.isAvailable, // Use 'disponivel'
    };

    try {
      const response = await fetch('https://docker-raichu.onrender.com/api/produtos/', { // Your FastAPI endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoProduto),
      });

      if (!response.ok) {
        // Handle error responses (including 422)
        const errorData = await response.json(); // Get detailed error from API
        console.error("Erro ao criar produto:", errorData); // Log detailed error to console
        alert(`Erro ao criar produto: ${errorData.detail || 'Erro desconhecido'}`); // Show user-friendly error
        return; // Stop processing if there was an error
      }

      // If response is ok (product created successfully)
      const data = await response.json();
      console.log("Produto criado com sucesso!", data);
      alert("Produto criado com sucesso!"); // Show success message
      onClose(); // Close the modal on success
      // Optionally: Update product list on the page here if needed

    } catch (error) {
      // Handle network errors or exceptions during fetch
      console.error("Erro de requisição:", error);
      alert("Erro de requisição ao servidor."); // Generic request error message
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Adicionar Produto</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Produto
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preço (R$)
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-purple-500 focus:border-purple-500"
              required
            >
              <option value="">Selecione uma categoria</option>
              <option value="hamburger">Hambúrguer</option>
              <option value="pizza">Pizza</option>
              <option value="drinks">Bebidas</option>
              <option value="snacks">Salgados</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL da Imagem
            </label>
            <input
              type="url"
              //value={formData.imageUrl}
              value="https://picsum.photos/200/300"
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-purple-500 focus:border-purple-500"
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Disponível</span>
            <Switch
              checked={formData.isAvailable}
              onChange={(checked) => setFormData({ ...formData, isAvailable: checked })}
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <BotaoLoaderMUI
              isLoading={isLoading}
                onClick={() => {}}
              text="Adicionar"
              loadingText="Adicionando..."
              variant="contained"
              type="submit"
              size="small"
              sx={{ 
                bgcolor: purple[600], 
                '&:hover': { 
                  bgcolor: purple[700] 
                },
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                py: '0.5rem',
                px: '1rem'
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
}