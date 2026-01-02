import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/slices/authSlice';
import adminReducer from '../redux/slices/adminSlice';
import userReducer from '../redux/slices/userSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    user: userReducer,
  },
});

export default store;
