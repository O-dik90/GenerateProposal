/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from 'api/base-url';

export const userLogin = createAsyncThunk('user/login', async (params, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post(`/login`, params);

    if (res.status === 200 && res.data) {
      const user = res.data;

      sessionStorage.setItem('user', JSON.stringify(user));

      return res.data;
    } else {
      return rejectWithValue('Login failed: Invalid response');
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong during login';
    return rejectWithValue(errorMessage);
  }
});

export const getMe = createAsyncThunk('user/getMe', async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get(`/refresh-token`);

    if (res.status === 200 && res.data) {
      const user = res.data;

      sessionStorage.setItem('user', JSON.stringify(user));

      return res.data;
    }

    return thunkAPI.rejectWithValue('No user data received');
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to refresh user data';
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const userLogout = createAsyncThunk('user/logout', async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.delete(`/logout`);
    if (res.status === 200) {
      sessionStorage.clear();
      return res.data;
    } else {
      return rejectWithValue('Logout failed');
    }
  } catch (error) {
    console.error(error.message);
    return rejectWithValue(error.response?.data?.message || error.message || 'Logout failed');
  }
});

const initialState = {
  user: null,
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
