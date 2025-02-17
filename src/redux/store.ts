import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';
import authSlice from './reducers/authSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice,
  },
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware().concat(apiSlice.middleware);
  },
});

export default store;

// Define RootState interface
export type RootState = ReturnType<typeof store.getState>;
