import AppReducer from './slices';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    app: AppReducer
  }
});

export default store;
