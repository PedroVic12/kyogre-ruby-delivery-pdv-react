from fastapi import FastAPI
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from databases import Database

# cria uma conexão com o banco de dados
engine = create_engine('sqlite:///banco_de_dados.db')

# define o objeto base
Base = declarative_base()

# define a classe que representa a tabela
class Tabela(Base):
    __tablename__ = 'tabela'

    id = Column(Integer, primary_key=True)
    nome = Column(String)
    idade = Column(Integer)

# inicializa o FastAPI
app = FastAPI()

# cria a tabela no banco de dados
Base.metadata.create_all(engine)

# cria uma sessão com o banco de dados
Session = sessionmaker(bind=engine)

# cria uma instância do banco de dados
db = Database(engine)


# endpoint para criar um novo registro
@app.post('/tabela')
async def criar_registro(nome: str, idade: int, session: Session = Depends(get_db)):
    registro = Tabela(nome=nome, idade=idade)
    session.add(registro)
    session.commit()

# endpoint para ler os registros da tabela
@app.get('/tabela')
async def ler_registros(session: Session = Depends(get_db)):
    resultado = session.query(Tabela).all()
    return resultado

# endpoint para atualizar um registro
@app.put('/tabela/{id}')
async def atualizar_registro(id: int, nome: str, idade: int, session: Session = Depends(get_db)):
    registro = session.query(Tabela).get(id)
    registro.nome = nome
    registro.idade