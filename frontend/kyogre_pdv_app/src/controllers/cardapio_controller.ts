import { Category, Product } from "../types/menu";

export default class CardapioService {
  private baseUrl: string = 'https://raichu-server.up.railway.app/api';
  private token: string | null;

  constructor(token: string | null) {
    this.token = token;
  }

  private getAuthHeaders(): HeadersInit {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    };
  }

  async buscarProdutos(): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseUrl}/produtos/`, {
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error(`Erro ao buscar produtos: ${response.status} - ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  }

  async editarProduto(produto: Product): Promise<Product> {
    const response = await fetch(`${this.baseUrl}/produtos/${produto.id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(produto),
    });
    if (!response.ok) throw new Error("Erro ao editar produto");
    return await response.json();
  }

  // Mesma lógica pros outros métodos:
  async criarProduto(produto: Product): Promise<Product> {
    const response = await fetch(`${this.baseUrl}/produtos/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(produto),
    });
    if (!response.ok) throw new Error("Erro ao criar produto");
    return await response.json();
  }

  async deletarProduto(id: number): Promise<void> {
    await fetch(`${this.baseUrl}/produtos/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
  }

  async fetchProdutosCardapioDigital(): Promise<Category[]> {
    try {
      const produtosDoServico = await this.buscarProdutos();
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
      console.error('Erro ao montar cardápio digital:', error);
      throw error;
    }
  }

  async buscarFotoStorage(): Promise<any[]> {
    //pegar do storage via API na /storage
    try {
      const response = await fetch(`${this.baseUrl}/storage/files`);
      if (!response.ok) {
        throw new Error(`Erro ao buscar fotos do storage: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar fotos do storage:', error);
      throw error;
    }
  }



  /**
   * Novas funcções devidos as alterações no cardápio
   */
  async buscarProdutosUsuario(): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseUrl}/produtos/`); // Assuming you want to list all products and filter on the frontend
      if (!response.ok) {
        throw new Error(`Erro ao buscar produtos do usuário: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      return data; // Assuming the API returns all products and you filter on the frontend
    } catch (error) {
      console.error('Erro ao buscar produtos do usuário:', error);
      throw error;
    }
  }

  async loadSupabaseCardapio( storage_name: string): Promise<any[] | null> {
    const baseUrl = 'https://raichu-server.up.railway.app/api';

    try {
      const response = await fetch(`${baseUrl}/storage/files?folder=${storage_name}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  }

  async updateProduct(produto_id: number, updates: Partial<Product>): Promise<Product> {
    try {
      const response = await fetch(`${this.baseUrl}/produtos/${produto_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,

        },
        body: JSON.stringify(updates), // Enviar apenas os campos que precisam ser atualizados
      });
  
      if (!response.ok) {
        throw new Error(`Erro ao atualizar produto: ${response.status} - ${response.statusText}`);
      }
  
      const data = await response.json();
      return data; // Retorna o produto atualizado
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
  }
  async getProductById(produto_id: number): Promise<Product> {
    try {
      const response = await fetch(`${this.baseUrl}/produtos/${produto_id}`);
      if (!response.ok) {
        throw new Error(`Erro ao buscar produto por ID: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar produto por ID:', error);
      throw error;
    }
  }
}

