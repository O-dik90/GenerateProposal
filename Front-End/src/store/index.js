import AppReducer from './slices';
import { configureStore } from '@reduxjs/toolkit';

const mode = import.meta.env.MODE;
const store = configureStore({
  reducer: {
    app: AppReducer
  },
  devTools: mode === 'development' ? true : false
});

export default store;
