// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';

export type UserCredentials = {
  login: string;
  password: string;
  isAuthenticated?: boolean;
};

const USERS_KEY = 'users';
const LOGGED_USER_KEY = 'loggedUser';

export function useAuth() {
  const [loggedUser, setLoggedUser] = useState<UserCredentials | null>(null);

  useEffect(() => {
    const storedLoggedUser = localStorage.getItem(LOGGED_USER_KEY);
    if (storedLoggedUser) {
      setLoggedUser(JSON.parse(storedLoggedUser));
    }
  }, []);

  const getUsers = () => {
    const storedUsers = localStorage.getItem(USERS_KEY);
    return storedUsers ? JSON.parse(storedUsers) : [];
  };

  const saveUser = (user: UserCredentials) => {
    const users = getUsers();
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
  };

  const signIn = ({ login, password }: UserCredentials) => {
    const users = getUsers();
    const user = users.find(
      (u: UserCredentials) => u.login === login && u.password === password
    );

    if (user) {
      const updatedUser = { ...user, isAuthenticated: true };
      localStorage.setItem(LOGGED_USER_KEY, JSON.stringify(updatedUser));
      setLoggedUser(updatedUser);
    } else {
      alert('Invalid credentials');
    }
  };

  const signUp = ({ login, password }: UserCredentials) => {
    const users = getUsers();
    if (users.some((u: UserCredentials) => u.login === login)) {
      alert('User already exists');
      return;
    }
    const newUser = { login, password, isAuthenticated: false };
    saveUser(newUser);
    alert('User registered successfully');
  };

  const logOut = () => {
    localStorage.removeItem(LOGGED_USER_KEY);
    setLoggedUser(null);
  };

  const deleteAccount = () => {
    if (loggedUser) {
      const users = getUsers();
      const updatedUsers = users.filter(
        (u: UserCredentials) => u.login !== loggedUser.login
      );
      localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
      logOut();
      alert('Account deleted successfully');
    } else {
      alert('No user logged in');
    }
  };

  return {
    loggedUser,
    signIn,
    signUp,
    logOut,
    deleteAccount,
  };
}
