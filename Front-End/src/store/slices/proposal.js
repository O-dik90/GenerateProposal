import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from 'api/base-url';

// Create async thunks for API calls
export const createProposal = createAsyncThunk('proposal/create', async (proposalData, { dispatch, rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/add-proposal', proposalData);

    if (response.data.message === 'success') {
      dispatch(fetchProposal(proposalData.user_id));
    }

    return response.data.message;
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
    return res.data.message;
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
      await dispatch(getListBabProposal(params?.proposal_id));
    }
    return res.data.message;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'An error occurred');
  }
});

export const updateDapus = createAsyncThunk('proposal/update-dapus', async (params, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.put(`/update-dapus`, params);

    return res.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'An error occurred');
  }
});

const initialState = {
  data: [],
  detail_id: {},
  pendahuluan: {},
  pelaksanaan: [],
  biaya: [],
  tinjuan: [],
  dapus: [],
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
        state.message = action.payload;
        state.error = null;
      })
      .addCase(createProposal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
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
      .addCase(fetchProposal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
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
      .addCase(detailProposal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
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
      .addCase(updateProposal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete proposal
      .addCase(deleteProposal.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProposal.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
        state.error = null;
      })
      .addCase(deleteProposal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Get detail proposal
      .addCase(getListBabProposal.pending, (state) => {
        state.loading = true;
      })
      .addCase(getListBabProposal.fulfilled, (state, action) => {
        state.loading = false;
        state.detail = action.payload.proposal_id;
        state.pendahuluan = action.payload.pendahuluan;
        state.pelaksanaan = action.payload.pelaksanaan;
        state.biaya = action.payload.biaya;
        state.tinjuan = action.payload.tinjauan;
        state.error = null;
      })
      .addCase(getListBabProposal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update Pendahuluan
      .addCase(updateBabPendahuluan.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBabPendahuluan.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
        state.error = null;
      })
      .addCase(updateBabPendahuluan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update Dapus
      .addCase(updateDapus.fulfilled, (state, action) => {
        state.loading = false;
        state.dapus = action.payload;
        state.error = null;
      })
      .addCase(updateDapus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { clearProposal } = proposalSlice.actions;
export default proposalSlice.reducer;
