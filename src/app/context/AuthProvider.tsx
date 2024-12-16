import { createContext, ReactNode, useEffect, useState } from 'react'
import {useNavigate} from 'react-router'

type UserCredentials = {
    login: string
    password: string
    isAuthenticated?: boolean
}

type AuthContextProps = {
    signIn(credentials: UserCredentials): void
    signUp(credentials: UserCredentials): void
    logOut(): void

    loggedUser?: UserCredentials
}

export const AuthContext = createContext({} as AuthContextProps) 

export function AuthProvider({ children }: { children: ReactNode }) {
    const navigate = useNavigate()

    const [users, setUsers] = useState()
    const [loggedUser, setLoggedUser] = useState()
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        function getUsers() {
            const storedUsers = localStorage.getItem('users');
            setUsers(storedUsers ? JSON.parse(storedUsers) : []) ;
        }

        function getLoggedUser() {
            const loggedUser = localStorage.getItem('loggedUser');
            if(loggedUser) {
                const parsed = JSON.parse(loggedUser)
                setIsAuthenticated(true)
                setLoggedUser(parsed)
                if(parsed.isAuthenticated) {
                    navigate("/home")
                }
            }
        }
        getLoggedUser()
        getUsers()
    },[])
    
    function signIn({login, password}: UserCredentials) {
        const findedUser = users?.find((item: {login: string, password: string}) => {
            const userAsValidates = [item.login === login, item.password === password].every(Boolean)
            return userAsValidates
        })

        findedUser.isAuthenticated = true

        localStorage.setItem('loggedUser', JSON.stringify(findedUser))
        navigate("/home")
    }
    function signUp({login, password}: UserCredentials) {
        const newUser = { login, password, isAuthenticated }
        const updatedUsers = [...users, newUser]
        localStorage.setItem('users', JSON.stringify(updatedUsers))
        navigate("/")
    }

    function logOut() {
        localStorage.removeItem('loggedUser')
        navigate('/')
    }
    return (
        <AuthContext.Provider value={{ signIn, signUp, loggedUser, logOut }}>
            {children}
        </AuthContext.Provider>
    )
}
