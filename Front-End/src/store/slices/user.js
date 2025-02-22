/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from 'api/base-url';

export const userRegister = createAsyncThunk('user/add-user', async (params, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post(`/add-user`, params);

    return res.data;
  } catch (error) {
    if (error.response) {
      return rejectWithValue(error);
    }
  }
});

const initialState = {
  status: 0,
  error: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userReset: (state) => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(userRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userRegister.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(userRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { userReset } = userSlice.actions;
export default userSlice.reducer;
