import  { useState } from 'react';
import { Chip, Stack, TextField  } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export default function PessoasChips() {
  const [pessoas, setPessoas] = useState<string[]>([]);
  const [pessoaAtiva, setPessoaAtiva] = useState<string | null>('Mesa');
  const [adicionando, setAdicionando] = useState(false);
  const [novoNome, setNovoNome] = useState('');

  const adicionarPessoa = () => {
    if (novoNome.trim() !== '' && !pessoas.includes(novoNome)) {
      setPessoas([...pessoas, novoNome]);
      setNovoNome('');
      setAdicionando(false);
      setPessoaAtiva(novoNome);
    }
  };

  const removerPessoa = (nome: string) => {
    setPessoas(pessoas.filter(p => p !== nome));
    if (pessoaAtiva === nome) setPessoaAtiva('Mesa');
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
      {/* Chip Fixo da Mesa */}
      <Chip
        label="Mesa"
        color={pessoaAtiva === 'Mesa' ? 'primary' : 'default'}
        variant={pessoaAtiva === 'Mesa' ? 'filled' : 'outlined'}
        onClick={() => setPessoaAtiva('Mesa')}
      />

      {/* Chips das Pessoas */}
      {pessoas.map((pessoa) => (
        <Chip
          key={pessoa}
          label={pessoa}
          onClick={() => setPessoaAtiva(pessoa)}
          onDelete={() => removerPessoa(pessoa)}
          deleteIcon={<DeleteIcon />}
          color={pessoaAtiva === pessoa ? 'primary' : 'default'}
          variant={pessoaAtiva === pessoa ? 'filled' : 'outlined'}
        />
      ))}

      {/* Adicionar Pessoa */}
      {adicionando ? (
        <TextField
          size="small"
          variant="outlined"
          value={novoNome}
          onChange={(e) => setNovoNome(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && adicionarPessoa()}
          onBlur={() => setAdicionando(false)}
          autoFocus
          placeholder="Nome"
        />
      ) : (
        <Chip
          icon={<AddIcon />}
          label="Adicionar Pessoa"
          onClick={() => setAdicionando(true)}
          variant="outlined"
        />
      )}
    </Stack>
  );
}
