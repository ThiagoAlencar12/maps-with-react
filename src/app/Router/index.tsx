import { useRoutes} from 'react-router'
import { Login } from '../../views/pages/Login'
import { SignUp } from '../../views/pages/SignUp'
import { Home } from '../../views/pages/Home'

export function Router() {
    const routes = useRoutes([
        {path: '/', element: <Login />},
        {path: '/signup', element: <SignUp />}, 
        {path: '/home', element: <Home />}

    ])
    return routes
}