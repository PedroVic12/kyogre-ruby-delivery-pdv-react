import { useState, useEffect, useCallback } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  TextField,
  Button,
  Box,
  Paper,
  CircularProgress,
  //Alert,
  CssBaseline,
  Divider,
} from "@mui/material";
import ReactMarkdown from "react-markdown";
import AgentModal from './components/AgentModal';
import AgentList from './components/AgentList';
import Sidebar from './components/Sidebar';

const useWebSocket = () => {
  const [ws, setWs] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:9400/ws');

    websocket.onopen = () => {
      console.log('Connected to WebSocket server');
      setConnectionStatus('CONECTADO');
    };

    websocket.onclose = () => {
      console.log('Disconnected from WebSocket server');
      setConnectionStatus('disconnected');
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('error');
    };

    setWs(websocket);

    return () => {
      if (websocket.readyState === WebSocket.OPEN) {
        websocket.close();
      }
    };
  }, []);

  return { ws, connectionStatus };
};

function App() {
  const [currentPage, setCurrentPage] = useState('/');
  const [agents, setAgents] = useState([
    {
      id: 1,
      name: "Pesquisador",
      role: "Pesquisador LLM e Google",
      goal: "Pesquisar informações relevantes sobre o assunto",
      backstory: "Você é um pesquisador curioso e experiente, está sempre em busca de informações relevantes.",
      expected_output: "Um relatório com parágrafos contendo Introdução, Desenvolvimento, e Conclusão",
    },
    {
      id: 2,
      name: "Redator",
      role: "Escritor e Copywriter",
      goal: "Escrever um artigo informativo sobre o assunto",
      backstory: "Você é um redator experiente e está sempre buscando escrita limpa e facil de entendimento.",
      expected_output: "Arquivo markdown bem escrito e objetivo de forma didática",
    },
    {
      id:3,
      name: "Marketing",
      role: "Marketing especializado em vendas, webDesign e SEO",
      goal: "Planejar e executar campanhas de marketing com foco em maximizar os lucros e fazer promoçoes de vendas",

      backstory: " Especialista em convencer o publico com uma linguagem engraçada e consegue vender ate uma caneta por qualquer valor, ja atuou em diversas empresas multinacionais e sabe fazer um bom funil de vendas ",
      expected_output: "Um relatório com suas ideias inovadoras de onde pode ser aplicadas suas estrategias com foco em vendas de aplicativos, sites, landing pages, sistemas web",
    },
    {
      id:4,
      name: "Programador",
      role:"Programador e Desenvolvedor de Software",
      goal: "Desenvolver um software para ajudar o mundo a ser melhor",
      backstory: "Voce e um desenvolvedor experiente e sempre busca melhorar suas habilidades de programacao das tecnologias Python, React, Django, Flutter, Nodejs, Rust",
      expected_output: "Um relatorio com suas ideias inovadoras de onde pode ser aplicadas suas estrategias com foco em vendas de aplicativos, sites, landing pages, sistemas web, modelos de IA, dashboards em python",
    }
  ]);

  const [selectedAgents, setSelectedAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [markdownResult, setMarkdownResult] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const { ws, connectionStatus } = useWebSocket();

  const handleMessage = useCallback((event) => {
    try {
      const data = JSON.parse(event.data);
      console.log('Received message:', data);

      if (data.type === 'task_results') {
        setLoading(false);
        if (data.status === 'success') {
          setMarkdownResult(data.markdown_result || '');
        } else {
          console.error('Task execution failed:', data.message);
          alert('Erro ao executar as tarefas. Por favor, tente novamente.');
        }
      }
    } catch (error) {
      console.error('Error processing message:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (ws) {
      ws.onmessage = handleMessage;
    }
  }, [ws, handleMessage]);

  const handleStartTasks = () => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      alert('Erro de conexão com o servidor. Por favor, recarregue a página.');
      return;
    }

    if (!prompt.trim()) {
      alert('Por favor, insira um tema antes de iniciar as tarefas.');
      return;
    }

    if (selectedAgents.length === 0) {
      alert('Por favor, selecione pelo menos um agente.');
      return;
    }

    // Create an array of selected agent IDs to maintain order
    const selectedAgentIds = selectedAgents.map(agent => agent.id);

    const tasks = selectedAgents.map((agent) => ({
      description: `${agent.role} - ${prompt}`,
      agentId: selectedAgentIds.indexOf(agent.id) + 1, // Convert to 1-based index
      expected_output: agent.expected_output,
      attempts: 2
    }));

    setLoading(true);
    setMarkdownResult('');

    ws.send(JSON.stringify({
      type: 'start_tasks',
      data: {
        tema: prompt,
        agents: selectedAgents,
        tasks: tasks
      }
    }));
  };

  const handleSaveAgent = (agentData) => {
    if (editingAgent) {
      setAgents(agents.map(agent => 
        agent.id === editingAgent.id ? { ...agentData, id: agent.id } : agent
      ));
    } else {
      const newAgent = {
        ...agentData,
        id: agents.length + 1,
      };
      setAgents([...agents, newAgent]);
    }
    setModalOpen(false);
    setEditingAgent(null);
  };

  const handleEditAgent = (agent) => {
    setEditingAgent(agent);
    setModalOpen(true);
  };

  const handleDeleteAgent = (agentId) => {
    setAgents(agents.filter(agent => agent.id !== agentId));
    setSelectedAgents(selectedAgents.filter(agent => agent.id !== agentId));
  };

  const handleSelectAgent = (agent) => {
    if (!selectedAgents.find(a => a.id === agent.id)) {
      setSelectedAgents([...selectedAgents, agent]);
    }
  };

  const renderContent = () => {
    switch (currentPage) {
      case '/':
        return (
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>
              Dashboard Overview
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e3f2fd' }}>
                  <Typography variant="h6">Agentes Ativos</Typography>
                  <Typography variant="h4">{agents.length}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e8f5e9' }}>
                  <Typography variant="h6">Tarefas Executadas</Typography>
                  <Typography variant="h4">0</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#fff3e0' }}>
                  <Typography variant="h6">Status</Typography>
                  <Typography variant="h4">{connectionStatus}</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        );
      case '/agents':
        return (
          <>
            <Box sx={{ mb: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setModalOpen(true)}
                sx={{ mr: 2 }}
              >
                Adicionar Novo Agente
              </Button>
            </Box>
            <AgentList
              agents={agents}
              onSelectAgent={handleSelectAgent}
              onEditAgent={handleEditAgent}
              onDeleteAgent={handleDeleteAgent}
            />
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Prompt para os agentes, descreva de forma detalhada seu pedido"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={loading}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
              <Divider gutterBottom sx={{marginBottom: 2, backgroundColor: 'rgba(0, 255, 132, 1)' }}>

              </Divider>
                <Typography variant="h3" gutterBottom>
                  Agentes Selecionados:
                </Typography>
                <Divider gutterBottom sx={{marginBottom: 2, backgroundColor: 'rgba(0, 255, 132, 1)' }}></Divider>
                {selectedAgents.map((agent) => (
                  // mostrando com o index


                  <Typography key={agent.id} variant="h4" >
                    {agent.id})    {agent.name}  ({agent.role})
                  </Typography>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleStartTasks}
                disabled={loading || !prompt.trim() || selectedAgents.length === 0}
                fullWidth
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Iniciar Tarefas'}
              </Button>
            </Grid>
            {markdownResult && (
              <Grid item xs={12}>
                <Paper 
                  sx={{ 
                    p: 4, 
                    mt: 2,
                    '& h1, & h2, & h3, & h4, & h5, & h6': {
                      textAlign: 'left',
                      color: '#1a237e',
                      mt: 3,
                      mb: 2
                    },
                    '& p': {
                      textAlign: 'left',
                      lineHeight: 1.6,
                      mb: 2
                    },
                    '& ul, & ol': {
                      textAlign: 'left',
                      pl: 4
                    },
                    '& li': {
                      mb: 1
                    },
                    '& pre': {
                      backgroundColor: '#f5f5f5',
                      p: 2,
                      borderRadius: 1,
                      overflow: 'auto'
                    },
                    '& code': {
                      backgroundColor: '#f5f5f5',
                      p: 0.5,
                      borderRadius: 0.5,
                      fontFamily: 'monospace'
                    },
                    '& blockquote': {
                      borderLeft: '4px solid #1a237e',
                      pl: 2,
                      ml: 0,
                      my: 2,
                      color: 'text.secondary'
                    },
                    '& table': {
                      width: '100%',
                      borderCollapse: 'collapse',
                      mb: 2
                    },
                    '& th, & td': {
                      border: '1px solid #ddd',
                      p: 1,
                      textAlign: 'left'
                    },
                    '& th': {
                      backgroundColor: '#f5f5f5'
                    },
                    '& img': {
                      maxWidth: '100%',
                      height: 'auto'
                    },
                    '& hr': {
                      my: 3,
                      border: 'none',
                      borderTop: '1px solid #ddd'
                    }
                  }}
                >
                  <ReactMarkdown>{markdownResult}</ReactMarkdown>
                </Paper>
              </Grid>
            )}
          </>
        );
      case '/automation':
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>Automação</Typography>
            <Typography variant="body1">
              Página em desenvolvimento para automação de tarefas usando Python.
            </Typography>
          </Paper>
        );
      case '/data-processing':
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>Processamento de Dados</Typography>
            <Typography variant="body1">
              Página em desenvolvimento para processamento e análise de dados.
            </Typography>
          </Paper>
        );
      case '/machine-learning':
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>Machine Learning</Typography>
            <Typography variant="body1">
              Página em desenvolvimento para modelos de machine learning.
            </Typography>
          </Paper>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Sidebar onPageChange={setCurrentPage} currentPage={currentPage} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          backgroundColor: '#f5f5f5',
        }}
      >
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${240}px)` },
            ml: { sm: `${240}px` },
          }}
        >
          <Toolbar backgroundColor= "indigo">
            <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
              SISTEMA DE AGENTES IA com Gemini API
            </Typography>
            <Typography variant="body2" sx={{ mr: 2 }}>
              Status: {connectionStatus}
            </Typography>
          </Toolbar>
        </AppBar>
        <Toolbar /> {/* This toolbar is for spacing below the AppBar */}
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {renderContent()}
        </Container>
        <AgentModal
          open={modalOpen}
          handleClose={() => {
            setModalOpen(false);
            setEditingAgent(null);
          }}
          handleSave={handleSaveAgent}
          editingAgent={editingAgent}
        />
      </Box>
    </Box>
  );
}

export default App;
