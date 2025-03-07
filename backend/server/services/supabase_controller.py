from supabase import Client

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