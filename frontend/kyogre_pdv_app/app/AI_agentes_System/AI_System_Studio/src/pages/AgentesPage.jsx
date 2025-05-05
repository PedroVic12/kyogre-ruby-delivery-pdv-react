
import React, { useState } from 'react';
import { Box, Button, Grid, TextField, Typography, Paper } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import AgentList from '../components/AgentList';



export default function AgentesPage() {
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
              <Typography variant="h3" gutterBottom>
                Agentes Selecionados:
              </Typography>
              {selectedAgents.map((agent) => (
                <Typography key={agent.id} variant="body1">
                  {agent.name} ({agent.role})
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
}