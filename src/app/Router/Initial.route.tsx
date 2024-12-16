import {  Route, Routes } from 'react-router'
import { Login } from '../../views/pages/Login'
import { SignUp } from '../../views/pages/SignUp'

import { Home } from '../../views/pages/Home'

export function InitialRouter() {
  return (
    <Routes>
        <Route path='/' element={<Login />}/>
        <Route path='/signup' element={<SignUp />}/>

          <Route path="/home" element={<Home />} />
    </Routes>
  )
}