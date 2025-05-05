import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';

const AgentModal = ({ open, handleClose, handleSave }) => {
  const [agentData, setAgentData] = React.useState({
    name: '',
    role: '',
    goal: '',
    backstory: '',
    expected_output: ''
  });

  const handleChange = (field) => (event) => {
    setAgentData({ ...agentData, [field]: event.target.value });
  };

  const handleSubmit = () => {
    handleSave(agentData);
    setAgentData({
      name: '',
      role: '',
      goal: '',
      backstory: '',
      expected_output: ''
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth fullScreen>
      <DialogTitle >Adicionar Novo Agente</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nome do Agente"
          fullWidth
          value={agentData.name}
          onChange={handleChange('name')}
        />
        <TextField
          margin="dense"
          label="Função/Papel"
          fullWidth
          value={agentData.role}
          onChange={handleChange('role')}
        />
        <TextField
          margin="dense"
          label="Objetivo"
          fullWidth
          multiline
          rows={2}
          value={agentData.goal}
          onChange={handleChange('goal')}
        />
        <TextField
          margin="dense"
          label="História/Contexto"
          fullWidth
          multiline
          rows={3}
          value={agentData.backstory}
          onChange={handleChange('backstory')}
        />
        <TextField
          margin="dense"
          label="Saída Esperada"
          fullWidth
          multiline
          rows={2}
          value={agentData.expected_output}
          onChange={handleChange('expected_output')}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Salvar Agente
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AgentModal;
