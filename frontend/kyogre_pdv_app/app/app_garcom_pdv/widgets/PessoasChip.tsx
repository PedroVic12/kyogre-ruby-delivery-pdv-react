import React, { useState } from 'react';
import { Chip, Stack, TextField,  Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person'; // Ícone para pessoa
import PeopleIcon from '@mui/icons-material/People'; // Ícone para Mesa

// Definir a estrutura da pessoa que será passada via props
interface Person {
  id: string;
  name: string;
}

// Definir as props que o componente receberá
interface PessoasChipsProps {
  people: Person[]; // Lista de pessoas gerenciada pelo componente pai
  selectedPersonId: string | null; // ID da pessoa/mesa selecionada, gerenciado pelo pai
  onSelectPerson: (id: string) => void; // Callback para notificar o pai sobre a seleção
  onAddPerson: (name: string) => void; // Callback para notificar o pai sobre adicionar pessoa
  onDeletePerson: (id: string) => void; // Callback para notificar o pai sobre remover pessoa
}


export default function PessoasChips({
  people,
  selectedPersonId,
  onSelectPerson,
  onAddPerson,
  onDeletePerson
}: PessoasChipsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');

  const handleAddConfirm = () => {
    if (newName.trim() !== '') {
      onAddPerson(newName.trim()); // Chama o callback do pai
      setNewName('');
      setIsAdding(false);
    } else {
       setIsAdding(false); // Cancela se nome vazio
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleAddConfirm();
    } else if (event.key === 'Escape') {
      setIsAdding(false);
      setNewName('');
    }
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: 2, p: 1, border: '1px dashed grey', borderRadius: 1 }}>
       <Typography variant="subtitle2" sx={{ mr: 1, color: 'text.secondary' }}>Para:</Typography>
      {/* Chip Fixo da Mesa */}
      <Chip
        icon={<PeopleIcon />} // Icone para Mesa
        label="Mesa"
        color={selectedPersonId === 'mesa' ? 'primary' : 'default'}
        variant={selectedPersonId === 'mesa' ? 'filled' : 'outlined'}
        onClick={() => onSelectPerson('mesa')} // Chama o callback do pai
        clickable
        size="medium"
      />

      {/* Chips das Pessoas */}
      {people.map((person) => (
        <Chip
          icon={<PersonIcon />} // Icone para Pessoa
          key={person.id}
          label={person.name}
          onClick={() => onSelectPerson(person.id)} // Chama o callback do pai
          onDelete={() => onDeletePerson(person.id)} // Chama o callback do pai
          deleteIcon={<DeleteIcon />}
          color={selectedPersonId === person.id ? 'secondary' : 'default'}
          variant={selectedPersonId === person.id ? 'filled' : 'outlined'}
          clickable
          size="medium"
        />
      ))}

      {/* Adicionar Pessoa */}
      {isAdding ? (
        <TextField
          size="small"
          variant="outlined"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleAddConfirm} // Confirma ao perder o foco também
          autoFocus
          placeholder="Nome da Pessoa"
          sx={{ maxWidth: '200px' }}
        />
      ) : (
        <Chip
          icon={<AddIcon />}
          label="Pessoa"
          onClick={() => setIsAdding(true)}
          variant="outlined"
          clickable
          size="medium"
        />
      )}
    </Stack>
  );
}
