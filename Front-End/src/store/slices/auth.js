/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from 'api/base-url';

export const userLogin = createAsyncThunk('user/login', async (params, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post(`/login`, params);

    if (res) {
      sessionStorage.setItem('user', JSON.stringify(res.data));
    }
    return res.data;
  } catch (error) {
    if (error.response) {
      return rejectWithValue(error);
    }
  }
});
export const getMe = createAsyncThunk('user/getMe', async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get(`/refresh-token`);

    if (res.data) {
      sessionStorage.setItem('user', JSON.stringify(res.data));
      return res.data;
    }

    return thunkAPI.rejectWithValue('No data received');
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

export const userLogout = createAsyncThunk('user/logout', async () => {
  try {
    const res = await axiosInstance.delete(`/logout`);
    if (res) {
      sessionStorage.clear();
    }
    return res.data;
  } catch (error) {
    console.error(error.message);
  }
});
const initialState = {
  user: null,
  token: null,
  loading: false,
  message: '',
  error: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload;
      })
      .addCase(userLogout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogout.fulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
        state.message = action.payload;
        state.error = null;
      })
      .addCase(userLogout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
      });
  }
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
