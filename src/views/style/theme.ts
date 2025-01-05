
import { createTheme } from '@mui/material/styles';


const theme = createTheme({
  palette: {
    primary: {
      main: '#6200ee', 
      light: '#bb86fc', 
      dark: '#3700b3', 
    },
    secondary: {
      main: '#03dac6',
      light: '#66fff9',
      dark: '#00a896',
    },
    background: {
      default: '#ffffff', 
      paper: '#f5f5f5', 
    },
    error: {
      main: '#b00020', 
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 400, lineHeight: 1.2 },
    h2: { fontSize: '2rem', fontWeight: 400, lineHeight: 1.3 },
    h3: { fontSize: '1.75rem', fontWeight: 400, lineHeight: 1.4 },
    body1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.5 },
    body2: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.43 },
    button: { textTransform: 'uppercase', fontWeight: 500 },
  },
  shape: {
    borderRadius: 12, 
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 2px 4px rgba(0,0,0,0.1)', 
        },
      },
    },
  },
});

export default theme;
