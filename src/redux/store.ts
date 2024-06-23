import { configureStore } from '@reduxjs/toolkit';
import taxReducer from './taxSlice';

const store = configureStore({
  reducer: {
    tax: taxReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
