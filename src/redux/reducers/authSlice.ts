import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userToken: (() => {
    const storedToken = localStorage.getItem('token');
    return storedToken ? JSON.parse(storedToken) : null;
  })(),
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userToken = action.payload;
      localStorage.setItem('token', JSON.stringify(action.payload));
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    logout: (state, _action) => {
      state.userToken = null;
      localStorage.removeItem('token');
    },
  },
});

export default authSlice.reducer;

export const { setCredentials, logout } = authSlice.actions;
