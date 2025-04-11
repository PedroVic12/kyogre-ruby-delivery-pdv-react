import CardapioService from "../controllers/cardapio_controller";
import { Category, Product } from "../types/menu";

// productCardapioRepository.ts
export const createProductCardapioRepository = (token: string) => {
  const cardapioService = new CardapioService(token);

  const fetchProducts = async (): Promise<Category[]> => {
    try {
      const produtosDoServico = await cardapioService.buscarProdutos();
      const categoriaMap = new Map<string, Product[]>();

      produtosDoServico.forEach((produto) => {
        const adicionais = Array.isArray(produto.adicionais)
          ? produto.adicionais.map((adicional: any) => ({
              nome_adicional: adicional.nome_adicional || "",
              preco: adicional.preco || 0,
            }))
          : [];

        if (produto.categoria && !categoriaMap.has(produto.categoria)) {
          categoriaMap.set(produto.categoria, []);
        }
        if (produto.categoria) {
          categoriaMap.get(produto.categoria)?.push({
            id: produto.id,
            nome_produto: produto.nome_produto,
            preco: produto.preco,
            url_imagem: produto.url_imagem,
            description: produto.descricao,
            isAvailable: produto.disponivel ?? true,
            adicionais,
            categoria: produto.categoria,
          });
        }
      });

      return Array.from(categoriaMap).map(([name, products], index) => ({
        id: index,
        name,
        products,
        color: 'black'
      }));
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  };

  return { fetchProducts };
};
