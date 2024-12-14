import { createContext, ReactNode } from 'react'
import {useNavigate} from 'react-router'

type UserCredentials = {
    login: string
    password: string
}

type AuthContextProps = {
    signIn(credentials: UserCredentials): void
    signUp(credentials: UserCredentials): void
    isAuthenticated: boolean
}

export const AuthContext = createContext({} as AuthContextProps) 

export function AuthProvider({children}: {children: ReactNode}) {
    const navigate = useNavigate()
    const isAuthenticated = false;
    function signIn({login, password}: UserCredentials) {
        console.log(login,password)
        navigate("/signup")
    }
    function signUp({login, password}: UserCredentials) {
        console.log(login,password)
        navigate("/signup")
    }
    return (
        <AuthContext.Provider value={{ isAuthenticated, signIn, signUp }}>
            {children}
        </AuthContext.Provider>
    )
}
