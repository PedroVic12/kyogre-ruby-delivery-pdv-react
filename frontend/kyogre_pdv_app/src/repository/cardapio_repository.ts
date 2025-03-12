// src/repositories/ProductRepository.ts

import { cardapioService } from "../controllers/cardapio_controller"; // Ajuste o caminho para o seu cardapioService

// Interfaces/Tipos (Defina conforme a estrutura REAL dos seus dados)

import { Category, Product } from '../types/menu';



class ProductRepository {
  private static instance: ProductRepository;
  private categoriesCache: Category[] | null = null; // Cache para categorias (opcional)

  private constructor() {
    // Construtor privado para singleton
  }

  public static getInstance(): ProductRepository {
    if (!ProductRepository.instance) {
      ProductRepository.instance = new ProductRepository();
    }
    return ProductRepository.instance;
  }


  public async fetchProducts(): Promise<Category[]> {
    try {
      const produtosDoServico = await cardapioService.buscarProdutos();

      // Agrupar produtos por categoria (similar à sua função carregarProdutos)
      const categoriaMap = new Map<string, Product[]>();
      produtosDoServico.forEach((produto: any) => { // TIPAGEM: 'any' - ajuste para a tipagem correta do retorno de buscarProdutos()
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
          //category: produto.categoria // Certifique-se de que a categoria está aqui
        });
      });

      // Converter o Map para o formato de categorias
      const categorias: Category[] = Array.from(categoriaMap).map(([name, products], index) => ({
        id: index,
        name,
        products
      }));

      this.categoriesCache = categorias; // Armazenar em cache (opcional)
      return categorias;

    } catch (error) {
      console.error('Erro ao buscar e formatar produtos no ProductRepository:', error);
      throw error; // Re-lançar o erro para o componente tratar
    }
  }

  // Método opcional para obter categorias (se necessário, ou pode ser feito no componente)
  public getCategoriesFromCache(): Category[] | null {
    return this.categoriesCache;
  }
}


// Certifique-se de exportar a instância SINGLETON
export const productRepository = ProductRepository.getInstance();