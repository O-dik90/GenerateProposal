import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from 'api/base-url';

// Create async thunks for API calls
export const createProposal = createAsyncThunk('proposal/create', async (proposalData, { dispatch, rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/add-proposal', proposalData);

    if (response.data.message === 'success') {
      dispatch(fetchProposal(proposalData.user_id));
    }

    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'An error occurred');
  }
});

export const fetchProposal = createAsyncThunk('proposal/getlist', async (id) => {
  const response = await axiosInstance.post(`/get-proposals/${id}`);
  return response.data;
});

export const detailProposal = createAsyncThunk('proposal/fetch-detail', async (id) => {
  const response = await axiosInstance.post(`/get-proposal/${id}`);
  return response.data;
});

export const updateProposal = createAsyncThunk('proposal/update', async (params, { dispatch, rejectWithValue }) => {
  try {
    const { id, user_id, ...updateData } = params;
    const res = await axiosInstance.put(`/update-proposal/${id}`, updateData);

    if (res.status === 200) {
      dispatch(fetchProposal(user_id));
    }
  } catch (error) {
    return rejectWithValue(error.response?.data || 'An error occurred');
  }
});

export const deleteProposal = createAsyncThunk('proposal/delete', async (params, { dispatch, rejectWithValue }) => {
  try {
    const res = await axiosInstance.delete(`/delete-proposal/${params.id}`);

    if (res.status === 200) {
      dispatch(fetchProposal(params.user_id));
    }
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'An error occurred');
  }
});

export const getListBabProposal = createAsyncThunk('proposal/get-detail', async (id) => {
  const response = await axiosInstance.post(`/get-listProposal-bab/${id}`);
  return response.data;
});

export const updateBabPendahuluan = createAsyncThunk('proposal/update-pendahuluan', async (params, { dispatch, rejectWithValue }) => {
  try {
    const res = await axiosInstance.put(`/update-bab-pendahuluan`, params);
    if (res.status === 200) {
      await dispatch(getListBabProposal(params?.proposals_id));
    }
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'An error occurred');
  }
});

export const updateDapus = createAsyncThunk('proposal/update-dapus', async (params, { dispatch, rejectWithValue }) => {
  try {
    const res = await axiosInstance.put(`/update-dapus`, params);
    if (res.status === 200) {
      await dispatch(getListBabProposal(params.proposals_id));
    }

    return res.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'An error occurred');
  }
});

export const updateBab = createAsyncThunk('proposal/update-bab', async (params, { dispatch, rejectWithValue }) => {
  try {
    const res = await axiosInstance.put(`/update-bab`, params);

    if (res.status === 200) {
      await dispatch(getListBabProposal(params?.proposals_id));
    }
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'An error occurred');
  }
});

const initialState = {
  data: [],
  metadata: {},
  pendahuluan: {},
  pelaksanaan: {},
  biaya: {},
  tinjauan: {},
  dapus: {},
  lampiran: {},
  loading: false,
  message: null,
  error: null
};

const proposalSlice = createSlice({
  name: 'proposal',
  initialState,
  reducers: {
    clearProposal: (state) => {
      state.proposal = initialState.data;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create proposal
      .addCase(createProposal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProposal.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.error = null;
      })
      // Fetch proposal
      .addCase(fetchProposal.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProposal.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.error = null;
      })
      // Detail proposal
      .addCase(detailProposal.pending, (state) => {
        state.loading = true;
      })
      .addCase(detailProposal.fulfilled, (state, action) => {
        state.loading = false;
        state.detail = action.payload;
        state.error = null;
      })
      // Update proposal
      .addCase(updateProposal.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProposal.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
        state.error = null;
      })
      // Delete proposal
      .addCase(deleteProposal.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProposal.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.error = null;
      })
      // Get detail proposal
      .addCase(getListBabProposal.pending, (state) => {
        state.loading = true;
      })
      .addCase(getListBabProposal.fulfilled, (state, action) => {
        state.loading = false;
        state.metadata = action.payload.metadata ? JSON.parse(action.payload.metadata) : {};
        state.pendahuluan = action.payload.pendahuluan;
        state.pelaksanaan = action.payload.pelaksanaan;
        state.biaya = action.payload.biaya;
        state.tinjauan = action.payload.tinjauan;
        state.dapus = action.payload.dapus;
        state.lampiran = action.payload.lampiran;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(getListBabProposal.rejected, (state, action) => {
        state.loading = true;
        state.error = action.error.message;
      })
      // Update Pendahuluan
      .addCase(updateBabPendahuluan.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBabPendahuluan.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.error = null;
      })
      // Update Dapus
      .addCase(updateDapus.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateDapus.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.error = null;
      })
      // Update Bab
      .addCase(updateBab.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBab.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.error = null;
      });
  }
});

export const { clearProposal } = proposalSlice.actions;
export default proposalSlice.reducer;
