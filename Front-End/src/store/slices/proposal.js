import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axios from 'axios';
import { proposalInitial } from 'store/initial/proposal';

// Create async thunks for API calls
export const createProposal = createAsyncThunk('proposal/create', async (proposalData) => {
  const response = await axios.post('/api/proposals', proposalData);
  return response.data;
});

export const fetchProposal = createAsyncThunk('proposal/fetch', async () => {
  // const response = await axios.get(`/api/proposals/${id}`);
  return Promise.resolve(proposalInitial);
});

export const updateProposal = createAsyncThunk('proposal/update', async ({ id, data }) => {
  const response = await axios.put(`/api/proposals/${id}`, data);
  return response.data;
});

export const deleteProposal = createAsyncThunk('proposal/delete', async (id) => {
  await axios.delete(`/api/proposals/${id}`);
  return id;
});

const initialState = {
  proposal: proposalInitial,
  loading: false,
  error: null
};

const proposalSlice = createSlice({
  name: 'proposal',
  initialState,
  reducers: {
    clearProposal: (state) => {
      state.proposal = initialState.proposal;
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
        state.proposal = action.payload;
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
        state.proposal = action.payload;
        state.error = null;
      })
      .addCase(fetchProposal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update proposal
      .addCase(updateProposal.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProposal.fulfilled, (state, action) => {
        state.loading = false;
        state.proposal = action.payload;
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
      .addCase(deleteProposal.fulfilled, (state) => {
        state.loading = false;
        state.proposal = initialState.proposal;
        state.error = null;
      })
      .addCase(deleteProposal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { clearProposal } = proposalSlice.actions;
export default proposalSlice.reducer;
