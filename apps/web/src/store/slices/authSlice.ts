import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type AuthState = {
  isAuthenticated: boolean;
  userId: string | null;
  username: string | null;
  discordId: string | null;
  role: string | null;
  permissions: string[];
};

const initialState: AuthState = {
  isAuthenticated: false,
  userId: null,
  username: null,
  discordId: null,
  role: null,
  permissions: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthUser(
      state,
      action: PayloadAction<{
        userId: string;
        username: string | null;
        discordId: string | null;
        role: string | null;
        permissions: string[];
      } | null>,
    ) {
      if (!action.payload) {
        state.isAuthenticated = false;
        state.userId = null;
        state.username = null;
        state.discordId = null;
        state.role = null;
        state.permissions = [];
        return;
      }
      state.isAuthenticated = true;
      state.userId = action.payload.userId;
      state.username = action.payload.username;
      state.discordId = action.payload.discordId;
      state.role = action.payload.role;
      state.permissions = action.payload.permissions;
    },
  },
});

export const { setAuthUser } = authSlice.actions;
export default authSlice.reducer;
