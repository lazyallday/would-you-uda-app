import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as API from '../api';

const getUsers = createAsyncThunk('users/get-users', async () => {
  const users = await API.getUsers();
  return users;
});

const initialState = {
  all: '',
  current: '',
  loading: false,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    auth: (state, action) => {
      localStorage.removeItem('currentUser')
      state.current = state.all[action.payload];
      localStorage.setItem('currentUser', action.payload);
    },
    logout: (state, _action) => {
      state.current = '';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getUsers.pending, (state, _action) => {
      state.loading = true;
    });
    builder.addCase(getUsers.fulfilled, (state, action) => {
      state.all = action.payload;
      state.loading = false;
    });
  },
});

const { auth, logout } = userSlice.actions;
const reducer = userSlice.reducer;

export {
  getUsers,
  auth,
  logout,
};

export default reducer;