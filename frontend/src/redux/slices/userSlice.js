import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";


export const fetchProductByProductId = createAsyncThunk(
  "user/getProductByProductId",
  async (productId, thunkAPI) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/product/id/${productId}`
      );
      return res.data; // product object
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Product not found"
      );
    }
  }
);

export const fetchProductByItemNumber = createAsyncThunk(
  "user/getProductByItemNumber",
  async (itemNumber, thunkAPI) => {
    console.log("fetchProductByItemNumber - itemNumber:", itemNumber);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/product/${itemNumber}`
      );
      return res.data; // product object
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Product not found"
      );
    }
  }
);

export const fetchItemBySKU = createAsyncThunk(
  "user/getItemBySKU",
  async (itemSKU, thunkAPI) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/items/${itemSKU}`
      );
      return res.data; // item object
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Item not found"
      );
    }
  }
);


const userSlice = createSlice({
  name: "user",
  initialState: {
    item: null,
    product: null,
    loading: false,
    error: null,
  },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductByItemNumber.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductByItemNumber.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload;
            })
            .addCase(fetchProductByItemNumber.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchItemBySKU.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchItemBySKU.fulfilled, (state, action) => {
                state.loading = false;
                state.item = action.payload;
            })
            .addCase(fetchItemBySKU.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchProductByProductId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductByProductId.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload;
            })
            .addCase(fetchProductByProductId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default userSlice.reducer;