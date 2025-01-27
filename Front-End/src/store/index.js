import AppReducer from './slices';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    app: AppReducer
  },
  devTools: false
});

export default store;
