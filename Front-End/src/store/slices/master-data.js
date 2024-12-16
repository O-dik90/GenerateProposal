import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from 'api/base-url';

const fetchMasterData = (endpoint) =>
  createAsyncThunk(endpoint, async (params) => {
    const response = await axiosInstance.post('/master-dropdown', params);
    return response.data;
  });
const fetchMasterDapus = (endpoint) =>
  createAsyncThunk(endpoint, async (params) => {
    const response = await axiosInstance.post('/master-dapus', params);
    return response.data;
  });

// Define all thunks
export const masterLomba = fetchMasterData('master/list-lomba');
export const masterPkm = fetchMasterData('master/list-pkm');
export const masterTahunLomba = fetchMasterData('master/list-tahun');
export const masterLampiranRole = fetchMasterData('master/list-lampiran-role');
export const masterGender = fetchMasterData('master/list-gender');
export const masterDapusStyle = fetchMasterDapus('master/list-dapus-style');
export const masterDapusRef = fetchMasterDapus('master/list-dapus-ref');

const initialState = {
  lomba: [],
  pkm: [],
  tahunLomba: [],
  gender: [],
  dapus: { style: [], reference: [] },
  lampiran: { role: [] },
  loading: false,
  error: null
};

const masterSlice = createSlice({
  name: 'master',
  initialState,
  reducers: {
    clearMaster: () => initialState
  },
  extraReducers: (builder) => {
    const handleFulfilled = (state, action, key) => {
      state.loading = false;
      state[key] = action.payload.data;
      state.error = null;
    };

    const dapusFulfilled = (state, action, key) => {
      state.loading = false;
      state.dapus[key] = action.payload.data;
      state.error = null;
    };
    const lampiranFulfilled = (state, action, key) => {
      state.loading = false;
      state.lampiran[key] = action.payload.data;
      state.error = null;
    };

    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    };

    builder
      .addCase(masterLomba.fulfilled, (state, action) => handleFulfilled(state, action, 'lomba'))
      .addCase(masterLomba.rejected, handleRejected)
      .addCase(masterPkm.fulfilled, (state, action) => handleFulfilled(state, action, 'pkm'))
      .addCase(masterPkm.rejected, handleRejected)
      .addCase(masterTahunLomba.fulfilled, (state, action) => handleFulfilled(state, action, 'tahunLomba'))
      .addCase(masterTahunLomba.rejected, handleRejected)
      .addCase(masterDapusStyle.fulfilled, (state, action) => dapusFulfilled(state, action, 'style'))
      .addCase(masterDapusStyle.rejected, handleRejected)
      .addCase(masterDapusRef.fulfilled, (state, action) => dapusFulfilled(state, action, 'reference'))
      .addCase(masterDapusRef.rejected, handleRejected)
      .addCase(masterLampiranRole.fulfilled, (state, action) => lampiranFulfilled(state, action, 'role'))
      .addCase(masterLampiranRole.rejected, handleRejected)
      .addCase(masterGender.fulfilled, (state, action) => handleFulfilled(state, action, 'gender'))
      .addCase(masterGender.rejected, handleRejected);
  }
});

export const { clearMaster } = masterSlice.actions;
export default masterSlice.reducer;
