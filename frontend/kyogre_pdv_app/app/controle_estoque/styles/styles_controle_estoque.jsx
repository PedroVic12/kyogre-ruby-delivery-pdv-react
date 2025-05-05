// ===============================
// Styled Components
// ===============================

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: '0.25rem',
    transition: '0.2s',
    '&:hover': {
        filter: 'brightness(0.9)',
    },
}));

const StyledFab = styled(Fab)(({ theme }) => ({
    position: 'fixed',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
    },
}));

const StyledInput = styled(TextField)(({ theme }) => ({
    '& .MuiInputBase-input': {
        color: theme.palette.mode === 'dark' ? '#fefefe' : '#333',
    },
    '& .MuiInput-underline:before': {
        borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.23)',
    },
    '& .MuiInput-underline:hover:before': {
        borderColor: theme.palette.mode === 'dark' ? '#fefefe' : '#333',
    },
    '& .MuiInput-underline:after': {
        borderColor: theme.palette.primary.main,
    },
    '& .MuiFormLabel-root': {
        color: theme.palette.mode === 'dark' ? '#fefefe' : '#333',
    },
    '& .MuiFormLabel-root.Mui-focused': {
        color: theme.palette.primary.main,
    },
}));

const StyledTextArea = styled('textarea')(({ theme }) => ({
    width: '100%',
    padding: '0.75rem',
    borderRadius: '0.25rem',
    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.23)'}`,
    backgroundColor: theme.palette.mode === 'dark' ? '#1c1a1d' : '#e0e0e0',
    color: theme.palette.mode === 'dark' ? '#fefefe' : '#333',
    fontFamily: 'inherit',
    fontSize: '1rem',
    '&:focus': {
        outline: 'none',
        borderColor: theme.palette.primary.main,
        boxShadow: `0 0 0 2px ${theme.palette.primary.light}`,
    },
    '&::placeholder': {
        color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
    },
}));
