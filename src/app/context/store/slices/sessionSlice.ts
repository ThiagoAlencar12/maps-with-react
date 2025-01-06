import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserCredentials = {
  login: string;
  password: string;
  isAuthenticated?: boolean;
};

type AuthState = {
  users: UserCredentials[];
  loggedUser: UserCredentials | null;
};

const initialState: AuthState = {
  users: [], 
  loggedUser: null, 
};

export const sessionSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signUp(state, action: PayloadAction<UserCredentials>) {
      const { login, password } = action.payload;
      const userExists = state.users.some((user) => user.login === login);

      if (userExists) {
        alert('User already exists');
        return;
      }

      const newUser = { login, password, isAuthenticated: false };
      state.users.push(newUser);
      alert('User registered successfully');
    },
    signIn(state, action: PayloadAction<UserCredentials>) {
      const { login, password } = action.payload;
      const user = state.users.find(
        (user) => user.login === login && user.password === password
      );

      if (user) {
        state.loggedUser = { ...user, isAuthenticated: true };
      } else {
        alert('Invalid credentials');
      }
    },
    logOut(state) {
      state.loggedUser = null;
      alert('You have logged out');
    },
    deleteAccount(state) {
      if (state.loggedUser) {
        const updatedUsers = state.users.filter(
          (user) => user.login !== state.loggedUser!.login
        );
        state.users = updatedUsers;
        state.loggedUser = null;
      } else {
        alert('No user logged in');
      }
    },
  },
});

export const { signUp, signIn, logOut, deleteAccount } = sessionSlice.actions;
export default sessionSlice.reducer;
