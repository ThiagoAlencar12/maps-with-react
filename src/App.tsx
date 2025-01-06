import {BrowserRouter} from 'react-router'
import {Provider} from 'react-redux'
import { InitialRouter } from './app/Router/Initial.route'
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'
import theme from './views/style/theme'
import { store } from './app/context/store';
export function App() {
  return (
  <ThemeProvider theme={theme}>
  <BrowserRouter>
  <Provider store={store}>
        <CssBaseline />
        <InitialRouter/>
    </Provider>
  </BrowserRouter>
  </ThemeProvider>
  )
}


