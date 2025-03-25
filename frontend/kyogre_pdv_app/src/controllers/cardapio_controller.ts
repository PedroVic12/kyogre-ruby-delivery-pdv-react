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
  }[];
}

/**
* Classe responsável por gerenciar as chamadas à API
*/
class CardapioService {
  private baseUrl: string = 'https://raichu-server.up.railway.app/api';

  /**
   * Busca todos os produtos do cardápio
   */
  async buscarProdutos(): Promise<Produto[]> {
      return this.fazerRequisicao<Produto[]>('/produtos/', 'GET');
  }

  /**
   * Cria um novo produto no cardápio
   */
  async criarProduto(produto: Produto): Promise<Produto> {
      return this.fazerRequisicao<Produto>('/produtos/', 'POST', produto);
  }

  /**
   * Deleta um produto do cardápio
   */
  async deletarProduto(id: number): Promise<void> {
      await this.fazerRequisicao(`/produtos/${id}`, 'DELETE');
  }

  /**
   * Busca todas as fotos do Storage
   */
  async buscarFotoStorage(): Promise<any[]> {
      return this.fazerRequisicao<any[]>('/storage/files', 'GET');
  }

  /**
   * Busca os produtos de um usuário específico baseado na tabela
   */
  async buscarProdutosUsuario(table_name: string): Promise<Produto[]> {
      return this.fazerRequisicao<Produto[]>(`/produtos?table=${table_name}`, 'GET');
  }

  /**
   * Carrega o cardápio do Supabase, incluindo produtos e imagens do storage
   */
  async loadSupabaseCardapio(table_name: string, storage_name: string): Promise<any> {
      return this.fazerRequisicao<any>('/storage/files', 'POST', {
          table: table_name,
          folder: storage_name
      });
  }

  /**
   * Método genérico para fazer requisições à API
   */
  private async fazerRequisicao<T>(endpoint: string, metodo: string, body?: any): Promise<T> {
      try {
          const options: RequestInit = {
              method: metodo,
              headers: {
                  'Content-Type': 'application/json',
              },
              body: body ? JSON.stringify(body) : undefined,
          };

          console.log(`📡 Requisição ${metodo} para: ${this.baseUrl}${endpoint}`, body || '');

          const response = await fetch(`${this.baseUrl}${endpoint}`, options);
          
          if (!response.ok) {
              throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
          }

          const data = await response.json();
          console.log(`✅ Resposta da API (${endpoint}):`, data);
          return data.data;
      } catch (error) {
          console.error(`❌ Erro ao fazer requisição ${metodo} (${endpoint}):`, error);
          throw error;
      }
  }
}

export const cardapioService = new CardapioService();
