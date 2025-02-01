import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { InitialRouter } from './app/router/Initial.route';

import { BrowserRouter } from 'react-router';
import { store } from './app/context/store';
import theme from "./views/style/theme";
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


