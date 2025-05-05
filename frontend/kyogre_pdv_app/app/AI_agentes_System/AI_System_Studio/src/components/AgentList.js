import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Button,
  IconButton,
  Box,
  Divider,
  
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const AgentList = ({ agents, onSelectAgent, onEditAgent, onDeleteAgent }) => {
  return (
    <Grid container spacing={2}>
      {agents.map((agent) => (
        <Grid item xs={12} sm={6} md={6} key={agent.id}>
          <Paper
            sx={{
              p: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            <Typography variant="h4" color='green' gutterBottom>
              {agent.name}
            </Typography>

            <Divider sx={{ 
              marginBottom: 2,
              backgroundColor: 'rgba(0, 255, 132, 1)',
             }}>
              
            </Divider>
            
            <Box

              sx={{
                position: 'absolute',
                top: 4,
                right: 1,
                display: 'flex',
                gap: 1,
              }}
            >
              <IconButton
                size="small"
                onClick={() => onEditAgent(agent)}
                color="primary"
     
              >
                <EditIcon />
              </IconButton>
              
              <IconButton
                size="small"
                onClick={() => onDeleteAgent(agent.id)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Box>

            <Typography variant="subtitle1" color="primary" gutterBottom>
              {agent.role}
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Objetivo:</strong> {agent.goal}
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Contexto:</strong> {agent.backstory}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => onSelectAgent(agent)}
            >
              Selecionar Agente na equipe
            </Button>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default AgentList;
