import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { apiSlice } from './api/apiSlice';
import appReducer from './slices/appSlice';
import authReducer from './slices/authSlice';
import serverReducer from './slices/serverSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    servers: serverReducer,
    settings: settingsReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
