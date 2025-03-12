// src/repositories/cardapio_repository.ts

import { cardapioService } from "../controllers/cardapio_controller"; // Adjust the path to your cardapioService
import { Category, Product } from '../types/menu';

class ProductCardapioRepository {
  private categoriesCache: Category[] | null = null; // Cache for categories (optional)

  public async fetchProducts(): Promise<Category[]> {
    try {
      const produtosDoServico = await cardapioService.buscarProdutos();

      // Group products by category (similar to your carregarProdutos function)
      const categoriaMap = new Map<string, Product[]>();
      produtosDoServico.forEach((produto) => {
        if (!categoriaMap.has(produto.categoria)) {
          categoriaMap.set(produto.categoria, []);
        }
        categoriaMap.get(produto.categoria)?.push({
          id: produto.id,
          name: produto.nome_produto,
          price: produto.preco,
          imageUrl: produto.url_imagem, // Now, the url_imagem is correctly taken from the API
          description: produto.descricao,
          isAvailable: produto.disponivel,
          
          adicionais: produto.adicionais,
          categoria: produto.categoria
        });
      });

      // Convert the Map to the categories format
      const categorias: Category[] = Array.from(categoriaMap).map(([name, products], index) => ({
        id: index,
        name,
        products
      }));

      this.categoriesCache = categorias; // Store in cache (optional)
      return categorias;

    } catch (error) {
      console.error('Error fetching and formatting products in ProductRepository:', error);
      throw error; // Re-throw the error for the component to handle
    }
  }

  // Optional method to get categories (if needed, or can be done in the component)
  public getCategoriesFromCache(): Category[] | null {
    return this.categoriesCache;
  }
}

// Make sure to export the SINGLETON instance
export default ProductCardapioRepository;
