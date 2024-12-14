import {BrowserRouter} from 'react-router'
import { Router } from './app/Router'

import { AuthProvider } from './app/context/AuthProvider'

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
          <Router />
      </AuthProvider>
    </BrowserRouter>
  )
}


