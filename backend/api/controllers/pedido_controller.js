const express = require('express');
const fs = require('fs');
const path = require('path');

class PedidosController {
    constructor() {
        this.router = express.Router();
        this.databaseFile = path.join(__dirname, 'pedidos.json'); // Caminho para pedidos.json (na mesma pasta do controlador)
        this.setupRoutes();
    }

    setupRoutes() {
        // Listar todos os pedidos
        this.router.get('/', this.listarPedidos.bind(this)); // Usar bind para manter o contexto do 'this'

        // Obter um pedido específico
        this.router.get('/:pedido_id', this.obterPedido.bind(this));

        // Criar um novo pedido
        this.router.post('/', this.criarPedido.bind(this));

        // Atualizar um pedido existente
        this.router.put('/:pedido_id', this.atualizarPedido.bind(this));

        // Deletar um pedido
        this.router.delete('/:pedido_id', this.deletarPedido.bind(this));
    }

    listarPedidos(req, res) {
        const pedidos = this.loadPedidos();
        res.json(pedidos);
    }

    obterPedido(req, res) {
        const pedidoId = parseInt(req.params.pedido_id);
        const pedidos = this.loadPedidos();
        const pedido = pedidos.find(p => p.id === pedidoId);

        if (pedido) {
            res.json(pedido);
        } else {
            res.status(404).json({ detail: 'Pedido não encontrado' });
        }
    }

    criarPedido(req, res) {
        const pedido = req.body;
        const pedidos = this.loadPedidos();

        // Gerar ID único
        const novoId = pedidos.reduce((maxId, p) => Math.max(maxId, p.id), 0) + 1;

        // Criar data e hora atual (similar ao Python)
        const agora = new Date();
        const dataPedido = {
            data: agora.toLocaleDateString('pt-BR'), // Formato DD/MM/AAAA
            hora: agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) // Formato HH:MM:SS
        };

        const novoPedido = {
            id: novoId,
            ...pedido,
            data_pedido: dataPedido
        };

        pedidos.push(novoPedido);
        this.savePedidos(pedidos);
        res.json(novoPedido);
    }

    atualizarPedido(req, res) {
        const pedidoId = parseInt(req.params.pedido_id);
        const pedidoAtualizado = req.body;
        let pedidos = this.loadPedidos();
        let pedidoIndex = -1;

        for (let i = 0; i < pedidos.length; i++) {
            if (pedidos[i].id === pedidoId) {
                pedidoIndex = i;
                break;
            }
        }

        if (pedidoIndex !== -1) {
            pedidos[pedidoIndex] = {
                id: pedidoId,
                ...pedidoAtualizado,
                data_pedido: pedidos[pedidoIndex].data_pedido // Mantém a data original
            };
            this.savePedidos(pedidos);
            res.json(pedidos[pedidoIndex]);
        } else {
            res.status(404).json({ detail: 'Pedido não encontrado' });
        }
    }

    deletarPedido(req, res) {
        const pedidoId = parseInt(req.params.pedido_id);
        let pedidos = this.loadPedidos();
        const pedidoIndex = pedidos.findIndex(p => p.id === pedidoId);

        if (pedidoIndex !== -1) {
            pedidos.splice(pedidoIndex, 1);
            this.savePedidos(pedidos);
            res.json({ message: 'Pedido deletado com sucesso' });
        } else {
            res.status(404).json({ detail: 'Pedido não encontrado' });
        }
    }


    loadPedidos() {
        try {
            if (fs.existsSync(this.databaseFile)) {
                const data = fs.readFileSync(this.databaseFile, 'utf8');
                return JSON.parse(data);
            }
            return [];
        } catch (error) {
            console.error("Erro ao carregar pedidos:", error);
            return []; // Em caso de erro, retorna uma lista vazia para evitar quebras
        }
    }

    savePedidos(pedidos) {
        try {
            fs.writeFileSync(this.databaseFile, JSON.stringify(pedidos, null, 4), 'utf8');
        } catch (error) {
            console.error("Erro ao salvar pedidos:", error);
        }
    }
}

module.exports = PedidosController;