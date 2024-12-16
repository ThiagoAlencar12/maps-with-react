import {BrowserRouter} from 'react-router'
import { AuthProvider} from './app/context/AuthProvider'
import { InitialRouter } from './app/Router/Initial.route'
export function App() {
  return (
  <BrowserRouter>
    <AuthProvider>
        <InitialRouter/>
    </AuthProvider>
  </BrowserRouter>
  )
}


