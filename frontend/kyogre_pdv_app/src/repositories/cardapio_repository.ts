// src/repositories/cardapio_repository.ts
import { cardapioService } from "../controllers/cardapio_controller";
import { Category, Product } from '../types/menu';

class ProductCardapioRepository {
  private categoriesCache: Category[] | null = null;

  public async fetchProducts(): Promise<Category[]> {
    try {
      const produtosDoServico = await cardapioService.buscarProdutos();

      const categoriaMap = new Map<string, Product[]>();
      produtosDoServico.forEach((produto) => {
        // Ensure produto.adicionais is an array or undefined
        const adicionais = Array.isArray(produto.adicionais)
          ? produto.adicionais.map((adicional: any) => ({
              nome_adicional: adicional.nome_adicional || "",
              preco: adicional.preco || 0,
            }))
          : [];

        if (!categoriaMap.has(produto.categoria)) {
          categoriaMap.set(produto.categoria, []);
        }
        categoriaMap.get(produto.categoria)?.push({
          id: produto.id,
          name: produto.nome_produto,
          price: produto.preco,
          imageUrl: produto.url_imagem,
          description: produto.descricao,
          isAvailable: produto.disponivel,
          adicionais: adicionais,
          categoria: produto.categoria
        });
      });

      const categorias: Category[] = Array.from(categoriaMap).map(([name, products], index) => ({
        id: index,
        name,
        products
      }));

      this.categoriesCache = categorias;
      return categorias;

    } catch (error) {
      console.error('Error fetching and formatting products in ProductRepository:', error);
      throw error;
    }
  }

  public getCategoriesFromCache(): Category[] | null {
    return this.categoriesCache;
  }
}

export default ProductCardapioRepository;
