# supabase_api_controller.py
from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any
from pydantic import BaseModel
import os
from supabase import Client, create_client

from dotenv import load_dotenv

load_dotenv()

#! Configuração do Supabase
url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(url, key)

class SupabaseCRUD:
    def __init__(self, supabase_client: Client, table_name: str):
        """
        Inicializa a classe SupabaseCRUD.

        Args:
            supabase_client: Cliente Supabase já inicializado.
            table_name: Nome da tabela no Supabase para realizar as operações CRUD.
        """
        self.supabase = supabase_client
        self.table_name = table_name
        
    def list_tables(self):
        """
        Lista as tabelas no Supabase.
        """
        try:
            response = self.supabase.table("items").select("*").execute()
            return response.data
        except Exception as e:
            return {"error": str(e)}
        

    def create(self, data: dict) -> dict:
        """
        Cria um novo registro na tabela.

        Args:
            data: Um dicionário contendo os dados a serem inseridos.
                  Exemplo: {'name': 'Produto A', 'description': 'Descrição do Produto A', 'price': 19.99}

        Returns:
            Um dicionário contendo a resposta da operação (dados inseridos ou erro).
        """
        try:
            response = self.supabase.table(self.table_name).insert(data).execute()
            if response.error:
                return {"error": response.error}
            else:
                return {"data": response.data, "message": "Registro criado com sucesso!"}
        except Exception as e:
            return {"error": str(e)}

    def read_all(self) -> dict:
        """
        Lê todos os registros da tabela.

        Returns:
            Um dicionário contendo a resposta da operação (lista de registros ou erro).
        """
        try:
            response = self.supabase.table(self.table_name).select("*").execute()
            if response.error:
                return {"error": response.error}
            else:
                return {"data": response.data}
        except Exception as e:
            return {"error": str(e)}

    def read_by_id(self, record_id: int) -> dict:
        """
        Lê um registro específico da tabela com base no ID.

        Args:
            record_id: O ID do registro a ser lido.

        Returns:
            Um dicionário contendo a resposta da operação (registro encontrado ou erro).
        """
        try:
            response = self.supabase.table(self.table_name).select("*").eq("id", record_id).execute()
            if response.error:
                return {"error": response.error}
            elif not response.data: # Verifica se a lista de dados está vazia (registro não encontrado)
                return {"data": None, "message": f"Registro com ID {record_id} não encontrado."}
            else:
                return {"data": response.data[0]} # Retorna o primeiro registro da lista (deve haver apenas um com ID único)
        except Exception as e:
            return {"error": str(e)}

    def update(self, record_id: int, updates: dict) -> dict:
        """
        Atualiza um registro existente na tabela com base no ID.

        Args:
            record_id: O ID do registro a ser atualizado.
            updates: Um dicionário contendo os campos e os novos valores a serem atualizados.
                     Exemplo: {'price': 24.99, 'description': 'Nova descrição do Produto A'}

        Returns:
            Um dicionário contendo a resposta da operação (dados atualizados ou erro).
        """
        try:
            response = self.supabase.table(self.table_name).update(updates).eq("id", record_id).execute()
            if response.error:
                return {"error": response.error}
            else:
                return {"data": response.data, "message": f"Registro com ID {record_id} atualizado com sucesso!"}
        except Exception as e:
            return {"error": str(e)}

    def delete(self, record_id: int) -> dict:
        """
        Deleta um registro da tabela com base no ID.

        Args:
            record_id: O ID do registro a ser deletado.

        Returns:
            Um dicionário contendo a resposta da operação (mensagem de sucesso ou erro).
        """
        try:
            response = self.supabase.table(self.table_name).delete().eq("id", record_id).execute()
            if response.error:
                return {"error": response.error}
            else:
                return {"message": f"Registro com ID {record_id} deletado com sucesso!"}
        except Exception as e:
            return {"error": str(e)}



router = APIRouter()

# *** Dependência para criar uma instância de SupabaseCRUD para 'produtos' ***
def get_produtos_crud() -> SupabaseCRUD:
    """Dependência para criar e fornecer uma instância de SupabaseCRUD para a tabela 'produtos'."""
    return SupabaseCRUD(supabase_client=supabase, table_name="produtos") # *** Use o NOME DA SUA TABELA AQUI ("produtos") ***

# Modelo Pydantic para validação de dados de produto (use o mesmo que já definiu)
class ProdutoCreate(BaseModel): # Reutilizando ProdutoCreate que já definimos antes
    nome_produto: str
    preco: float
    categoria: str
    url_imagem: str
    descricao: str
    disponivel: bool


# *** Rota POST para criar um novo produto ***
@router.post("/produtos/", response_model=Dict[str, Any], status_code=201) # Retorna um dict e status 201 (Created)
async def create_produto(produto: ProdutoCreate, produtos_crud: SupabaseCRUD = Depends(get_produtos_crud)):
    """
    Cria um novo produto no banco de dados Supabase.
    """
    result = produtos_crud.create(produto.dict()) # Use produto.dict() para converter Pydantic model para dict
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result # Retorna o resultado (data e mensagem de sucesso)


# *** Rota GET para listar todos os produtos ***
@router.get("/produtos/", response_model=Dict[str, Any]) # Retorna um dict com a lista de produtos
async def list_produtos(produtos_crud: SupabaseCRUD = Depends(get_produtos_crud)):
    """
    Lista todos os produtos do banco de dados Supabase.
    """
    result = produtos_crud.read_all()
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result # Retorna o resultado (data: lista de produtos)


# *** Rota GET para ler um produto por ID (exemplo - pode adicionar depois se precisar) ***
@router.get("/produtos/{produto_id}", response_model=Dict[str, Any])
async def read_produto(produto_id: int, produtos_crud: SupabaseCRUD = Depends(get_produtos_crud)):
    """
    Lê um produto específico por ID do banco de dados Supabase.
    """
    result = produtos_crud.read_by_id(produto_id)
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    if result["data"] is None:
        raise HTTPException(status_code=404, detail=f"Produto com ID {produto_id} não encontrado") # 404 Not Found se não encontrar
    return result


# Você pode adicionar mais rotas (PUT, DELETE, etc.) seguindo este padrão
@router.put("/produtos/{produto_id}", response_model=Dict[str, Any])
async def update_produto(produto_id: int, produto: ProdutoCreate, produtos_crud: SupabaseCRUD = Depends(get_produtos_crud)):
    """
    Atualiza um produto existente no banco de dados Supabase.
    """
    result = produtos_crud.update(produto_id, produto.dict())
    return result

@router.delete("/produtos/{produto_id}", response_model=Dict[str, Any])
async def delete_produto(produto_id: int, produtos_crud: SupabaseCRUD = Depends(get_produtos_crud)):
    """
    Deleta um produto existente no banco de dados Supabase.
    """
    result = produtos_crud.delete(produto_id)
    return result


