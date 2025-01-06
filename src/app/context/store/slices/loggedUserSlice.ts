import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const loadLoggedUser = createAsyncThunk("loggedUser/load", async () => {
  const loggedUser = localStorage.getItem("loggedUser");
  if (loggedUser) {
    const parsed = JSON.parse(loggedUser);
    return parsed;
  }
});

export const loggedUserSlice = createSlice({
  name: "loggedUser",
  initialState: {
    user: {
        login: '',
        isAuthenticated: false
    }
  },

  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(loadLoggedUser.fulfilled, (state, action) => {
        state.user = action.payload;
    });
  },
});
