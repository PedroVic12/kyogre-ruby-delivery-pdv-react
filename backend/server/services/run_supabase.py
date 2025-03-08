from supabase import create_client, Client
from supabase_controller import SupabaseCRUD
from dotenv import load_dotenv
import os

load_dotenv()

#! Configuração do Supabase
url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(url, key)

# Criar uma instância da classe SupabaseCRUD para a tabela 'items'

tabelas_array = ["cardapio","pedidos","produtos","usuarios"]



# *** à tabela que você quer usar no seu banco de dados Supabase.
items_crud = SupabaseCRUD(supabase_client=supabase, table_name=tabelas_array[0])

# *** Dados de entrada CORRIGIDOS para corresponder ao seu formulário "Adicionar Produto" ***
novo_item = {
    'nome_produto': 'Hamburguer',       # Nome do Produto (Texto) - Adaptado do formulário
    'preco': 21,                        # Preço (Número) - Removido 'R$', usado apenas o valor numérico
    'categoria': 'Pizza',              # Categoria (Texto) - Conforme exemplo do formulário
    'url_imagem': 'https://picsum.photos/200/300', # URL da Imagem (Texto)
    'descricao': 'Hamburguer delicionso', # Descrição (Texto)
    'disponivel': True                  # Disponível (Booleano) - Assumindo 'marcado' como True
}

# *** IMPORTANTE: Adapte os nomes das chaves acima ('nome_produto', 'preco', etc.)
# *** para corresponderem EXATAMENTE aos nomes das COLUNAS na sua tabela 'items' no Supabase.
# *** Se suas colunas no Supabase estiverem em inglês (ex: 'product_name', 'image_url'),
# *** você DEVE usar os nomes em inglês aqui no dicionário 'novo_item'.

try:

    # Exemplo de CREATE (agora usando os dados do formulário)
    create_result = items_crud.create(novo_item)
    print("Resultado CREATE:", create_result)

    # Exemplo de READ ALL (continua igual, lê todos os registros da tabela 'items')
    read_all_result = items_crud.read_all()
    print("\nResultado READ ALL:", read_all_result)


    # Exemplo de DELETE (supondo que um ID exista, ex: ID 1 - tenha cuidado ao deletar registros!)
    # *** TENHA CERTEZA de que você quer deletar o registro com ID '1' antes de executar
    record_id_para_deletar = 1
    delete_result = items_crud.delete(record_id_para_deletar)
    print(f"\nResultado DELETE ({record_id_para_deletar}):", delete_result)

    # Exemplo de READ ALL novamente para verificar as alterações
    read_all_result_apos_delete = items_crud.read_all()
    print("\nResultado READ ALL após DELETE:", read_all_result_apos_delete)

except Exception as e:
    print(f"Ocorreu um erro: {e}")