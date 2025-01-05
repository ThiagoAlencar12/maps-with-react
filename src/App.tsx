import {BrowserRouter} from 'react-router'
import { AuthProvider} from './app/context/AuthProvider'
import { InitialRouter } from './app/Router/Initial.route'
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'
import theme from './views/style/theme'
export function App() {
  return (
  <ThemeProvider theme={theme}>
  <BrowserRouter>
    <AuthProvider>
        <CssBaseline />
        <InitialRouter/>
    </AuthProvider>
  </BrowserRouter>
  </ThemeProvider>
  )
}


