import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import uiReducer from './uiSlice';
import horariosReducer from './horariosSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    horarios: horariosReducer,
  },
});
