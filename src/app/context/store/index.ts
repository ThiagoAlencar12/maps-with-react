import { configureStore } from '@reduxjs/toolkit';
import { useSelector, TypedUseSelectorHook, useDispatch } from 'react-redux';

import { loggedUserSlice } from './slices/loggedUserSlice';
import { sessionSlice } from './slices/sessionSlice';

export const store = configureStore({
    reducer: {
        loggedUser: loggedUserSlice.reducer,
        session: sessionSlice.reducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppDispatch: () => AppDispatch = useDispatch
