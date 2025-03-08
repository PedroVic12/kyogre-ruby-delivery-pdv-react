const express = require('express');
const cors = require('cors');
const pedidosController = require('./controllers/pedido_controller'); // Importa o controlador de pedidos

class RaichuWebServer {
    constructor() {
        this.app = express();
        this.app.use(cors({ // Configuração do CORS (similar ao FastAPI)
            origin: '*', // ⚠️ PARA TESTE LOCAL. EM PRODUÇÃO, DEFINA ORIGENS ESPECÍFICAS!
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
            allowedHeaders: ['Content-Type', 'Authorization'] // Headers permitidos
        }));
        this.app.use(express.json()); // Middleware para parsear JSON no body das requisições

        this.pedidosController = new pedidosController(); // Instancia o controlador de pedidos

        this.setupRoutes();
    }

    setupRoutes() {
        // Rota base da API (prefixo /api)
        const apiRouter = express.Router();

        // Inclui as rotas do controlador de pedidos dentro de /api
        apiRouter.use('/pedidos', this.pedidosController.router);

        // Monta o router /api no app principal
        this.app.use('/api', apiRouter);

        // Rota de status da API (fora do prefixo /api, na raiz)
        this.app.get('/', (req, res) => {
            res.json({ status: 'online', message: 'Raichu Web Server PDV API está funcionando!' });
        });
    }

    run(port = 8000) {
        this.app.listen(port, () => {
            console.log(`Raichu Web Server PDV API rodando em http://localhost:${port}`);
        });
    }
}

// Cria instância do servidor
const server = new RaichuWebServer();

// Para ser chamado ao executar o arquivo diretamente
if (require.main === module) {
    server.run(); // Inicia o servidor na porta 8000 (padrão)
}

// Exporta o app Express (se precisar usar em testes ou outros módulos)
module.exports = server.app;