import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const initialState = {
    products: [],
    isLoading: false,
    error: null
};


const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.products = action.payload;
                state.isLoading = false
            })
            .addCase(fetchProducts.rejected, (state) => {
                state.isLoading = false;
                state.error = 'Failed to fetch products'
            })
    }
});

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async () => {
        // fetch products from api
    }
)

export const { setProducts, setLoading, setError } = productSlice.actions;
export default productSlice.reducer;