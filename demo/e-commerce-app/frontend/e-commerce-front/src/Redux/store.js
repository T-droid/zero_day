import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';

const store = configureStore({
    reducer: {
        cart: cartReducer,
        product: productReducer,
        user: userReducer
    }
});

export default store;