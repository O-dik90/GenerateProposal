import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from 'api/base-url';

// Create async thunks for API calls
export const createProposal = createAsyncThunk('proposal/create', async (proposalData, { dispatch, rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`/create-proposal/${proposalData.user_id}`, proposalData);

    if (response.status === 201) {
      dispatch(fetchProposal(proposalData.user_id));
    }

    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'An error occurred');
  }
});

export const fetchProposal = createAsyncThunk('proposal/getlist', async (id) => {
  const response = await axiosInstance.get(`/get-proposals/${id}`);
  return response.data;
});

export const detailProposal = createAsyncThunk('proposal/fetch-detail', async (params, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`/get-proposal/${params.user_id}`, params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'An error occurred');
  }
});

export const updateProposal = createAsyncThunk('proposal/update', async (params, { dispatch, rejectWithValue }) => {
  try {
    const { user_id, ...updateData } = params;
    const res = await axiosInstance.put(`/update-proposal/${user_id}`, updateData);

    if (res.status === 200) {
      dispatch(fetchProposal(user_id));
    }
  } catch (error) {
    return rejectWithValue(error.response?.data || 'An error occurred');
  }
});

export const deleteProposal = createAsyncThunk('proposal/delete', async (params, { dispatch, rejectWithValue }) => {
  try {
    const res = await axiosInstance.delete(`/delete-proposal/${params.item_id}`);

    if (res.status === 200) {
      dispatch(fetchProposal(params.user_id));
    }
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'An error occurred');
  }
});

export const getListLampiran = createAsyncThunk('proposal/get-statement', async (params, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`/get-files/${params?.proposal_id}`, params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.message || 'An error occurred');
  }
});

export const uploadFileLampiran = createAsyncThunk('proposal/upload-file', async (params, { rejectWithValue }) => {
  try {
    console.log('Entries:', [...params.entries()]);
    const proposalId = params.get('proposal_id');

    if (!proposalId) {
      throw new Error('proposal_id is missing in FormData');
    }
    const res = await axiosInstance.postForm(`/add-file/${proposalId}`, params, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'An error occurred');
  }
});

export const deleteFileLampiran = createAsyncThunk('proposal/delete-file', async (params, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.delete(`/delete-file/${params.id}`);

    return res.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'An error occurred');
  }
});

export const updateFileLampiran = createAsyncThunk('proposal/update-file', async (params, { dispatch, rejectWithValue }) => {
  try {
    const proposalId = params.get('proposal_id');

    if (!proposalId) {
      throw new Error('proposal_id is missing in FormData');
    }
    const res = await axiosInstance.put(`/update-file/${proposalId}`, params);
    if (res.status === 200) {
      await dispatch(getListBabProposal(proposalId));
    }

    return res.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'An error occurred');
  }
});

export const getBabProposalDetail = createAsyncThunk('proposal/get-bab-proposal', async (params, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`/get-bab-proposal/${params.id}`, params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data);
  }
});

export const updateBabProposalDetail = createAsyncThunk('proposal/update-bab-proposal', async (params, { dispatch, rejectWithValue }) => {
  try {
    const res = await axiosInstance.put(`/update-bab-proposal/${params?.id}`, params?.data);
    if (res.status === 200) {
      await dispatch(getBabProposalDetail(params?.proposals_id));
    }
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'An error occurred');
  }
});

export const getLampiranProposalDetail = createAsyncThunk('proposal/get-lampiran-proposal', async (params, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`/get-bab-proposal/${params.id}`, params);

    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data);
  }
});

export const updateLampiranProposalDetail = createAsyncThunk(
  'proposal/update-lampiran-proposal',
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/update-bab-proposal/${params?.id}`, params?.data);
      if (res.status === 200) {
        await dispatch(getLampiranProposalDetail(params?.proposals_id));
      }
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const lampiranIdentitasAsync = createAsyncThunk('proposal/lampiranIdentitas', async (payload) => {
  return payload;
});

export const updateChangesAsync = createAsyncThunk('proposal/updateChanges', async (payload) => {
  return payload;
});

const initialState = {
  data: [],
  proposal_detail: [],
  lampiran: {},
  identitas: [],
  document: [],
  status: {
    changesData: false,
    confirmData: false
  },
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
      .addCase(createProposal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Fetch proposal
      .addCase(fetchProposal.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProposal.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
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
        state.proposal_detail = action.payload[0]?.proposalDetails;
        state.error = null;
      })
      .addCase(detailProposal.rejected, (state) => {
        state.loading = false;
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
      // Get List Lampiran
      .addCase(getListLampiran.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.document = [];
      })
      .addCase(getListLampiran.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.document = action.payload.data;
        state.error = null;
      })
      .addCase(getBabProposalDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBabProposalDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.proposal_detail = action.payload;
        state.error = null;
      })
      .addCase(getBabProposalDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateBabProposalDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBabProposalDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(updateBabProposalDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getLampiranProposalDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLampiranProposalDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.lampiran = action.payload;
        state.error = null;
      })
      .addCase(getLampiranProposalDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateLampiranProposalDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLampiranProposalDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(updateLampiranProposalDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(lampiranIdentitasAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(lampiranIdentitasAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.identitas = action.payload;
        state.error = null;
      })
      .addCase(lampiranIdentitasAsync.rejected, (state) => {
        state.loading = false;
        state.identitas = [];
        state.error = null;
      })
      .addCase(updateChangesAsync.fulfilled, (state, action) => {
        state.status = action.payload;
      });
  }
});

export const { clearProposal } = proposalSlice.actions;
export default proposalSlice.reducer;
