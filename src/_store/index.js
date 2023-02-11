import { configureStore } from '@reduxjs/toolkit';
import authReducer from 'slice/authSlice';
import userReducer from 'slice/userSlice';
import cartReducer from 'slice/cartSlice';
export default configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        cart: cartReducer
    },
});
