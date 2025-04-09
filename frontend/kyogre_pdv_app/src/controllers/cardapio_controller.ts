// src/services/api.ts

/**
 * Interface para representar um produto do cardápio
 */
import { Product } from "../types/menu";

/**
 * Classe responsável por gerenciar as chamadas à API
 */
class CardapioService {
  private baseUrl: string = 'https://raichu-server.up.railway.app/api';

  /**
   * Busca todos os produtos do cardápio
   */
  async buscarProdutos(token: string): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseUrl}/produtos/`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Incluindo o token no header
          'Content-Type': 'application/json', // Adicionado por boa prática
        },
      });
      if (!response.ok) {
        throw new Error(`Erro ao buscar produtos: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  }

  /**
   * Cria um novo produto no cardápio
   */
  async criarProduto(produto: Product, token: string): Promise<Product> {
    try {
      const response = await fetch(`${this.baseUrl}/produtos/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, // Incluindo o token no header
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(produto),
      });
      if (!response.ok) {
        throw new Error(`Erro ao criar produto: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
  }

  async criarNovoProduto(produto: Product): Promise<Product> {
    try {
      console.log("Enviando produto para API:", produto); // Log do objeto antes do envio

      const response = await fetch(`${this.baseUrl}/produtos/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(produto),
      });

      console.log("Resposta bruta da API:", response);

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Resposta JSON da API:", data);

      return data; // Assuming the API returns the created product directly
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
  }

  /**
   * Deleta um produto do cardápio
   */
  async deletarProduto(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/produtos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Erro ao deletar produto: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
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

export const cardapioService = new CardapioService();
