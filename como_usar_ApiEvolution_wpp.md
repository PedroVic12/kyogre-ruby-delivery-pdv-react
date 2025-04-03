

## Instalar o Evolution-api pelo github

1) faça a copia do .env-exemplo para .env
  - Altere algumas coisas no .env e no docker-compose

  - Configurando o container do banco de dados, apenas alterei a semnha e mandei rodar nao no local host mas sim pelo container do banco

  ```
    # Provider: postgresql | mysql
    DATABASE_PROVIDER=postgresql
    #DATABASE_CONNECTION_URI='postgresql://user:pass@postgres:5432/evolution?schema=public'
    DATABASE_CONNECTION_URI='postgresql://user:senha@postgres:5432/evolution?schema=public'
  ```

  ```
  postgres:
    container_name: postgres
    image: postgres:15
    networks:
      - evolution-net
    command: ['postgres', '-c', 'max_connections=1000', '-c', 'listen_addresses=*']
    restart: always
    ports:
      - 5432:5432
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=senha
      - POSTGRES_DB=evolution
      - POSTGRES_HOST_AUTH_METHOD=trust
    volumes:
      - postgres_data:/var/lib/postgresql/data
    expose:
      - 5432

    ```

    - Na minha maquina, ja estou rodando o redis na porta 6357 que é o padrao do projeto, alterei a porta no .env e no docker compose

    ```
    # no docker
    redis:
    image: redis:latest
    networks:
      - evolution-net
    container_name: redis
    command: >
      redis-server --port 5555 --appendonly yes
    volumes:
      - evolution_redis:/data
    ports:
      - 5555:5555

      # .env
      CACHE_REDIS_URI=redis://redis:5555/6

      ```

2) faça o npm install e verifique o prisma intalado

3) Rode npm run build se quiser funcionar

4) faça o docker compose up -d para montar o container rodar

  - Se tiver erro de docker damean, apenas abre o docker desktop no pc

5) Se o docker buildar certinho, veja ele com docker ps

6) Se tiver rodandno faça docker logs evolutionapi

7) Deve estar rodando no 8080 no localhost e vc vai no manager dele e coloca a chave de API no .env


8) faça um teste de api acessando

  http://localhost:8080/message/sendText/GroundonBot_Delivery_Kyogre

  e colocandono header

  key         value
  apikey      sua_chave_api_evolution

  e no body:
  {
    "number":"5521999289987",
    "text":"voce é um gostoso, pv"
  }
