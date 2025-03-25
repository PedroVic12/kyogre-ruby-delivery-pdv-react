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
    async buscarProdutos() {
      
      try {
          const response = await fetch(`${this.baseUrl}/produtos/`);
          const data = await response.json();

          console.log("Buscando produtos", data)
          console.log("Consultando os dados no redis e jogando na api")

          return data; // Directly return the parsed JSON data
        } catch (error) {
          console.error('Erro ao buscar produtos:', error);
          throw error;
        }
      }
  
    /**
     * Cria um novo produto no cardápio
     */
    async criarProduto(produto: Product): Promise<Product> {
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
    
        return data.data[0];
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
        await fetch(`${this.baseUrl}/produtos/${id}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Erro ao deletar produto:', error);
        throw error;
      }
    }

    async buscarFotoStorage(){

      //pegar do storage via API na /storage
      try {
        const response = await fetch(`${this.baseUrl}/storage/files`);
        const data = await response.json();
        return data.data;
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        throw error;
      }


    }


    async buscarProdutosUsuario(table_name: string): Promise<Product[]> {
      try {
        const response = await fetch(`${this.baseUrl}/produtos/${table_name}`);
        const data = await response.json();
        return data.data;
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        throw error;
      }
    }
    
    

    async loadSupabaseCardapio(table_name: string, storage_name: string) {
      const baseUrl = 'https://raichu-server.up.railway.app/api';
      
      try {
        const response = await fetch(`${baseUrl}/storage/files`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ table: table_name, folder:storage_name }),
        });
        
        
        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.length > 0 ? data : null;
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        throw error;
      }
    }


    // async function setupSupabaseCardapio() {
    //   try {
        
    //     // Busca os produtos
    //     const response = await fetch(`https://raichu-server.up.railway.app/api/produtos/${tabela}`);
    //     const data = await response.json();
    
    //     console.log("📦 Produtos carregados:", data);
    
    //     // Busca as imagens no storage
    //     const imagensResponse = await fetch(`https://raichu-server.up.railway.app/api/storage/files`);
    //     const imagensData = await imagensResponse.json();
    
    //     console.log("🖼️ Imagens encontradas:", imagensData);
    
    //     // Filtra as pastas (nomes dos clientes)
    //     const pastasClientes = imagensData.slice(0, 3).map(item => item.name);
    //     console.log("📂 Pastas dos clientes:", pastasClientes);
    
    //     // Filtra as imagens da pasta do usuário logado
    //     const imagensCliente = imagensData.filter(img => img.name.includes(bucket));
        
    //     // Monta um objeto { nomeArquivo: urlImagem }
    //     const imagensMap = imagensCliente.reduce((acc, img) => {
    //       acc[img.name] = `https://raichu-server.up.railway.app/api/storage/files/${bucket}/${img.name}`;
    //       return acc;
    //     }, {} as Record<string, string>);
    
    //     console.log("🔗 URLs das imagens:", imagensMap);
    
    //     // Associa os produtos às imagens
    //     const produtosComImagens = data.map(produto => ({
    //       ...produto,
    //       url_imagem: imagensMap[produto.nome_produto] || produto.url_imagem, // Se não tiver imagem, mantém a original
    //     }));
    
    //   } catch (error) {
    //     console.error("❌ Erro ao carregar produtos:", error);
    //   } 
    // }
    
    

  }
  
  export const cardapioService = new CardapioService();