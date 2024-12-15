import {  Route, Routes, Outlet, Navigate } from 'react-router'
import { Login } from '../../views/pages/Login'
import { SignUp } from '../../views/pages/SignUp'
import { useContext } from 'react'

import {AuthContext} from '../../app/context/AuthProvider'
import { Home } from '../../views/pages/Home'

function PrivateRoute () {
    const { loggedUser } = useContext(AuthContext);
    return loggedUser ? <Outlet /> : <Navigate to="/" />;
}
export function InitialRouter() {
  return (
    <Routes>
        <Route path='/' element={<Login />}/>
        <Route path='/signup' element={<SignUp />}/>

        <Route path="/home" element={<PrivateRoute />}>
          <Route path="/home" element={<Home />} />
        </Route>
    </Routes>
  )
}