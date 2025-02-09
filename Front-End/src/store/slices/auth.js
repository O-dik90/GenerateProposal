/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from 'api/base-url';

export const userLogin = createAsyncThunk('user/login', async (params, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post(`/login`, params);

    if (res) {
      sessionStorage.setItem('token', res.data.token);
    }
    return res.data;
  } catch (error) {
    console.log(error);
    if (error.response) {
      return rejectWithValue(error);
    }
  }
});
export const getMe = createAsyncThunk('user/getMe', async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.post('/my-self');
    if (res) {
      sessionStorage.setItem('token', res.data.token);
    }
    return res.data;
  } catch (error) {
    console.error('Error in getMe:', error);
    if (error.response) {
      if (error.response.status === 401) {
        thunkAPI.dispatch(userLogout());
        toast.error('Sessi kadaluarsa. Silahkan login kembali.');
      }
      return thunkAPI.rejectWithValue(error.response.data);
    }
    return thunkAPI.rejectWithValue('An unknown error occurred');
  }
});
export const userLogout = createAsyncThunk('user/logout', async () => {
  try {
    const res = await axiosInstance.delete(`/logout`);
    if (res) {
      sessionStorage.removeItem('token');
    }
    return res.data;
  } catch (error) {
    console.log(error);
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
