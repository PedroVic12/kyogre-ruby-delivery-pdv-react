import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Typography from '@mui/material/Typography';

interface Action {
  icon: React.ReactNode;
  name: string;
  onClick: () => void;
}

interface FloatActionButtonProps {
  mainButtonIcon: React.ReactNode;
  mainButtonTooltip: string;
  actions: Action[];
}

export function FloatActionButton({
  mainButtonIcon,
  mainButtonTooltip,
  actions,
}: FloatActionButtonProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Box sx={{ position: 'fixed', bottom: 16, right: 16,  }}>
      <SpeedDial
        ariaLabel={mainButtonTooltip}
        icon={<SpeedDialIcon icon={mainButtonIcon} />}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        open={open}
      >
        {actions.map((action, index) => (
          <SpeedDialAction
            key={index}
            icon={action.icon}
            tooltipTitle={
              <Typography variant="body2" sx={{ color: 'black', fontWeight: 'bold', }}>
                {action.name}
              </Typography>
                


            }
            tooltipOpen // Garante que o texto aparece ao lado do ícone
              
            onClick={() => {
              action.onClick();
              setOpen(false); // Fecha o menu após clicar na ação
            }}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}