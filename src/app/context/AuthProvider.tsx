import { type ReactNode, createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

type UserCredentials = {
  login: string;
  password: string;
  isAuthenticated?: boolean;
};

type AuthContextProps = {
  signIn(credentials: UserCredentials): void;
  signUp(credentials: UserCredentials): void;
  logOut(): void;
  deleteAccount(): void;
  loggedUser?: UserCredentials;
};

export const AuthContext = createContext({} as AuthContextProps);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserCredentials[]>([]);
  const [loggedUser, setLoggedUser] = useState<UserCredentials | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    function getUsers() {
      const storedUsers = localStorage.getItem("users");
      setUsers(storedUsers ? JSON.parse(storedUsers) : []);
    }

    function getLoggedUser() {
      const loggedUser = localStorage.getItem("loggedUser");
      if (loggedUser) {
        const parsed = JSON.parse(loggedUser);
        setIsAuthenticated(true);
        setLoggedUser(parsed);
        if (parsed.isAuthenticated) {
          navigate("/home");
        }
      }
    }
    getLoggedUser();
    getUsers();
  }, []);

  function signIn({ login, password }: UserCredentials) {
    const findedUser = users?.find(
      (item: { login: string; password: string }) => {
        const userAsValidates = [
          item.login === login,
          item.password === password,
        ].every(Boolean);
        return userAsValidates;
      },
    );

    findedUser.isAuthenticated = true;

    localStorage.setItem("loggedUser", JSON.stringify(findedUser));
    navigate("/home");
  }
  function signUp({ login, password }: UserCredentials) {
    const newUser = { login, password, isAuthenticated };
    if (users) {
      const updatedUsers = [...users, newUser];
      localStorage.setItem("users", JSON.stringify(updatedUsers));
    }
    navigate("/");
  }

  function logOut() {
    localStorage.removeItem("loggedUser");
    navigate("/");
  }

  function deleteAccount() {
    if (window.confirm("Tem certeza de que deseja excluir sua conta?")) {
      const usersData = localStorage.getItem("users");
      const locationsData = localStorage.getItem(
        `${loggedUser?.login}-addressList`,
      );
      if (locationsData) {
        const locations = JSON.parse(locationsData);
        localStorage.removeItem(locations);
      }
      if (usersData) {
        const users = JSON.parse(usersData);
        const updatedUsers = users.filter(
          (user: { login: string }) => user.login !== loggedUser?.login,
        ); 
        localStorage.setItem("users", JSON.stringify(updatedUsers));

        if (updatedUsers.length < users.length) {
          alert("Conta excluída com sucesso!");
          logOut();
        } else {
          alert("Erro ao excluir a conta.");
        }
      }
    }
  }
  return (
    <AuthContext.Provider
      value={{ signIn, signUp, loggedUser, logOut, deleteAccount }}
    >
      {children}
    </AuthContext.Provider>
  );
}
