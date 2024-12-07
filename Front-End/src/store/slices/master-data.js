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
export const masterTahunLomba = createAsyncThunk('master/list-tahun', async (params) => {
  const response = await axiosInstance.post('/master-dropdown', params);
  return response.data;
});

export const masterDapusStyle = createAsyncThunk('master/list-dapus-style', async (params) => {
  const response = await axiosInstance.post('/master-dapus', params);
  return response.data;
});

export const masterDapusRef = createAsyncThunk('master/list-dapus-ref', async (params) => {
  const response = await axiosInstance.post('/master-dapus', params);
  return response.data;
});

const initialState = {
  lomba: [],
  pkm: [],
  tahun_lomba: [],
  dapus: {
    style: [],
    reference: []
  },
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
      .addCase(masterPkm.fulfilled, (state, action) => {
        state.loading = false;
        state.pkm = action.payload.data;
        state.error = null;
      })
      .addCase(masterPkm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(masterTahunLomba.fulfilled, (state, action) => {
        state.loading = false;
        state.tahun_lomba = action.payload.data;
        state.error = null;
      })
      .addCase(masterTahunLomba.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Master Dapus
      .addCase(masterDapusStyle.fulfilled, (state, action) => {
        state.loading = false;
        state.dapus.style = action.payload.data;
        state.error = null;
      })
      .addCase(masterDapusStyle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(masterDapusRef.fulfilled, (state, action) => {
        state.loading = false;
        state.dapus.reference = action.payload.data;
        state.error = null;
      })
      .addCase(masterDapusRef.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { clearMaster } = masterSlice.actions;
export default masterSlice.reducer;
