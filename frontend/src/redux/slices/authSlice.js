import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, thunkAPI) => {
    console.log("Attempting login with:", { email, password }); // Debugging line
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/login`, { email, password });
      return res.data; // { user, token, role, message }
    } catch (error) {
      console.error("Login error:", error); // Debugging line
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Login failed'
      );
    }
  }
);


 const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    role: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.role;

        // ✅ token stored centrally
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));

      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

  export const { logout } = authSlice.actions;
  export default authSlice.reducer;
