import { createContext, ReactNode } from 'react'

type UserCredentials = {
    login: string
    password: string
}

type AuthContextProps = {
    signIn(credentials: UserCredentials): void
    isAuthenticated: boolean
}

export const AuthContext = createContext({} as AuthContextProps) 

export function AuthProvider({children}: {children: ReactNode}) {
    const isAuthenticated = false;
    function signIn({login, password}: UserCredentials) {
        console.log(login,password)
    }
    return (
        <AuthContext.Provider value={{ isAuthenticated, signIn }}>
            {children}
        </AuthContext.Provider>
    )
}
