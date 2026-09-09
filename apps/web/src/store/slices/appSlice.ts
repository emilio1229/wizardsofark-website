import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type AppState = {
  bootstrapped: boolean;
};

const initialState: AppState = {
  bootstrapped: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setBootstrapped(state, action: PayloadAction<boolean>) {
      state.bootstrapped = action.payload;
    },
  },
});

export const { setBootstrapped } = appSlice.actions;
export default appSlice.reducer;
