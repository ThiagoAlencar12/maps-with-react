import { useEffect } from 'react'
import { Route, Routes } from 'react-router'
import { Login } from '../../views/pages/Login'
import { SignUp } from '../../views/pages/SignUp'

import { Home } from '../../views/pages/Home'

import { useAppDispatch } from '../context/store'
import { loadLoggedUser } from '../context/store/slices/loggedUserSlice'

export function InitialRouter() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(loadLoggedUser())
  }, [dispatch])

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      <Route path="/home" element={<Home />} />
    </Routes>
  )
}
