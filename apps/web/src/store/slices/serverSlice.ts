import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { LiveServerStatus } from '@woa/shared';

type ServerUiState = {
  selectedServerId: string | null;
  statusFilter: LiveServerStatus | 'all';
  search: string;
};

const initialState: ServerUiState = {
  selectedServerId: null,
  statusFilter: 'all',
  search: '',
};

const serverSlice = createSlice({
  name: 'servers',
  initialState,
  reducers: {
    setSelectedServerId(state, action: PayloadAction<string | null>) {
      state.selectedServerId = action.payload;
    },
    setStatusFilter(state, action: PayloadAction<LiveServerStatus | 'all'>) {
      state.statusFilter = action.payload;
    },
    setServerSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
  },
});

export const { setSelectedServerId, setStatusFilter, setServerSearch } = serverSlice.actions;
export default serverSlice.reducer;
