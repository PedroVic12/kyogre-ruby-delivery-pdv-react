// src/services/api.ts

/**
 * Interface para representar um produto do cardápio
 */
interface Produto {
    id: number;
    nome_produto: string;
    preco: number;
    categoria: string;
    url_imagem: string;
    descricao: string;
    disponivel: boolean;
    adicionais: {
      nome_adicional: string;
      preco: number;
    };
    }
  
  /**
   * Classe responsável por gerenciar as chamadas à API
   */
  
  class CardapioService {
    private baseUrl: string = 'https://docker-raichu.onrender.com/api';
  
    /**
     * Busca todos os produtos do cardápio
     */
    async buscarProdutos(): Promise<Produto[]> {
      try {
        const response = await fetch(`${this.baseUrl}/produtos/`);
        const data = await response.json();
        return data.data;
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        throw error;
      }
    }
  
    /**
     * Cria um novo produto no cardápio
     */
    async criarProduto(produto: Produto): Promise<Produto> {
      try {
        const response = await fetch(`${this.baseUrl}/produtos/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(produto),
        });
        const data = await response.json();
        return data.data[0];
      } catch (error) {
        console.error('Erro ao criar produto:', error);
        throw error;
      }
    }
  
    /**
     * Deleta um produto do cardápio
     */
    async deletarProduto(id: string): Promise<void> {
      try {
        await fetch(`${this.baseUrl}/produtos/${id}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Erro ao deletar produto:', error);
        throw error;
      }
    }
  }
  
  export const cardapioService = new CardapioService();