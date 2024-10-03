import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    totalAmount: 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const newItem = action.payload;
            state.items.push(newItem);
            state.totalAmount += newItem.price;
        },
        removeFromCart: (state, action) => {
            const id = action.payload;
            const existingItemIndex = state.items.findIndex(item => item.id === id);
            if (existingItemIndex >= 0) {
                const existingItem = state.items[existingItemIndex];
                state.totalAmount -= existingItem.price;
                state.items.splice(existingItemIndex, 1);
            }
        },
    },
});

export const { addToCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;