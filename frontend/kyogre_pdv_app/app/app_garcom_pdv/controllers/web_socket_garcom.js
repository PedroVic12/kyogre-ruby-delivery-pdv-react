const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let tables = [
  { id: 1, name: 'Mesa 1', status: 'livre', customers: 0 },
  { id: 2, name: 'Mesa 2', status: 'livre', customers: 0 },
  { id: 3, name: 'Mesa 3', status: 'livre', customers: 0 },
  { id: 4, name: 'Mesa 4', status: 'livre', customers: 0 },
];

wss.on('connection', (ws) => {
  console.log('Novo cliente conectado');

  // Enviar o estado inicial das mesas para o cliente
  ws.send(JSON.stringify({ type: 'init', payload: tables }));

  // Receber atualizações do cliente
  ws.on('message', (message) => {
    const data = JSON.parse(message);

    if (data.type === 'update') {
      const { tableId, status, customers } = data.payload;

      // Atualizar o estado da mesa
      const table = tables.find((t) => t.id === tableId);
      if (table) {
        table.status = status;
        table.customers = customers || 0;
      }

      // Notificar todos os clientes conectados
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'update', payload: tables }));
        }
      });
    }
  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});

console.log('Servidor WebSocket rodando na porta 8080');