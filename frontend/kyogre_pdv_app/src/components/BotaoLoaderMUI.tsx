import React from 'react';
import { Button, CircularProgress, Box } from '@mui/material';
import { blue } from '@mui/material/colors';

interface BotaoLoaderMUIProps {
  isLoading: boolean;
  onClick: () => void;
  text: string;
  loadingText?: string;
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  sx?: any;
  type?: 'button' | 'submit' | 'reset';
}

/**
 * Componente de botão com indicador de carregamento
 * 
 * @param {boolean} isLoading - Se o botão está em estado de carregamento
 * @param {function} onClick - Função a ser executada ao clicar no botão
 * @param {string} text - Texto do botão
 * @param {string} loadingText - Texto a ser exibido durante o carregamento (opcional)
 * @param {string} variant - Variante do botão (text, outlined, contained)
 * @param {string} color - Cor do botão (primary, secondary, success, error, info, warning)
 * @param {string} size - Tamanho do botão (small, medium, large)
 * @param {boolean} fullWidth - Se o botão deve ocupar toda a largura disponível
 * @param {boolean} disabled - Se o botão está desabilitado
 * @param {React.ReactNode} startIcon - Ícone no início do botão
 * @param {React.ReactNode} endIcon - Ícone no final do botão
 * @param {object} sx - Estilos adicionais
 * @param {string} type - Tipo do botão (button, submit, reset)
 */
const BotaoLoaderMUI: React.FC<BotaoLoaderMUIProps> = ({
  isLoading,
  onClick,
  text,
  loadingText = 'Carregando...',
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  startIcon,
  endIcon,
  sx = {},
  type = 'button',
}) => {
  return (
    <Box sx={{ position: 'relative', display: 'inline-block', ...sx }}>
      <Button
        variant={variant}
        color={color}
        size={size}
        disabled={isLoading || disabled}
        onClick={onClick}
        fullWidth={fullWidth}
        startIcon={!isLoading ? startIcon : undefined}
        endIcon={!isLoading ? endIcon : undefined}
        type={type}
        sx={{
          ...(isLoading && {
            color: 'text.disabled',
            '& .MuiButton-startIcon, & .MuiButton-endIcon': {
              opacity: 0.5,
            },
          }),
        }}
      >
        {isLoading ? loadingText : text}
      </Button>
      {isLoading && (
        <CircularProgress
          size={24}
          sx={{
            color: blue[500],
            position: 'absolute',
            top: '50%',
            left: 14,
            marginTop: '-12px',
            marginLeft: '-12px',
          }}
        />
      )}
    </Box>
  );
};

export default BotaoLoaderMUI; 