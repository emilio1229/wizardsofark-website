import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type AuthState = {
  isAuthenticated: boolean;
  userId: string | null;
  role: string | null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  userId: null,
  role: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthUser(
      state,
      action: PayloadAction<{ userId: string; role: string } | null>,
    ) {
      if (!action.payload) {
        state.isAuthenticated = false;
        state.userId = null;
        state.role = null;
        return;
      }
      state.isAuthenticated = true;
      state.userId = action.payload.userId;
      state.role = action.payload.role;
    },
  },
});

export const { setAuthUser } = authSlice.actions;
export default authSlice.reducer;
