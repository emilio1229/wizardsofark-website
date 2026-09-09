import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type SettingsState = {
  reducedMotionOverride: boolean | null;
};

const initialState: SettingsState = {
  reducedMotionOverride: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setReducedMotionOverride(state, action: PayloadAction<boolean | null>) {
      state.reducedMotionOverride = action.payload;
    },
  },
});

export const { setReducedMotionOverride } = settingsSlice.actions;
export default settingsSlice.reducer;
