const WebSocket = require('ws');

// Connecting to WebSocket server with new port
const raichu_url = "https://docker-raichu.onrender.com:9000/"
const url = "ws://localhost:9300"
const ws = new WebSocket(raichu_url);

ws.on('open', function open() {
    console.log('Connected to WebSocket server');

    const tema = "Como trabalhar com tecnologias como Python, Django, React, Sqlite com ferramentas lowcode para criacao de paginas";
    const agents = [
        {
            id: 1,
            name: 'Pesquisador',
            role: 'Pesquisador',
            goal: 'Pesquisar informações relevantes',
            backstory: 'Você é um pesquisador experiente.'
        },
        {
            id: 2,
            name: 'Redator',
            role: 'Redator',
            goal: 'Escrever um documento em markdown sobre o tema',
            backstory: 'Você é um redator habilidoso, com boas habilidades de escrita.'
        }
    ];

    const tasks = [
        {
            description: `Pesquisar sobre ${tema}`,
            agentId: 1,
            expected_output: 'Relatório detalhado.',
            attempts: 2
        },
        {
            description: `Escrever artigo em markdown sobre ${tema}`,
            agentId: 2,
            expected_output: 'Artigo didático em markdown.',
            attempts: 2
        }
    ];

    ws.send(JSON.stringify({
        type: 'start_tasks',
        data: { tema, agents, tasks }
    }));
});

ws.on('message', function incoming(data) {
    const response = JSON.parse(data);
    
    if (response.type === 'task_results') {
        console.log('Task Results:', response.results);
        if (response.markdown_result) {
            console.log('Markdown Result:', response.markdown_result);
        }
    } else if (response.type === 'error') {
        console.error('Error:', response.message);
    }
});

ws.on('close', function close() {
    console.log('Disconnected from WebSocket server');
});

ws.on('error', function error(err) {
    console.error('WebSocket error:', err);
});