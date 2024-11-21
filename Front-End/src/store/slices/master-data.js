import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from 'api/base-url';

// Create async thunks for API calls
export const masterLomba = createAsyncThunk('master/list-lomba', async (params) => {
  const response = await axiosInstance.post('/master-dropdown', params);
  return response.data;
});
export const masterPkm = createAsyncThunk('master/list-pkm', async (params) => {
  const response = await axiosInstance.post('/master-dropdown', params);
  return response.data;
});

const initialState = {
  lomba: [],
  pkm: [],
  loading: false,
  error: null
};

const masterSlice = createSlice({
  name: 'master',
  initialState,
  reducers: {
    clearProposal: (state) => {
      state.master = initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      // Master Data
      .addCase(masterLomba.fulfilled, (state, action) => {
        state.loading = false;
        state.lomba = action.payload.data;
        state.error = null;
      })
      .addCase(masterLomba.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //
      .addCase(masterPkm.fulfilled, (state, action) => {
        state.loading = false;
        state.pkm = action.payload.data;
        state.error = null;
      })
      .addCase(masterPkm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { clearMaster } = masterSlice.actions;
export default masterSlice.reducer;
