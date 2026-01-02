import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createCategory = createAsyncThunk(
  "admin/createCategory",
  async ({ name, token }, thunkAPI) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/categories`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Create category response data:", res.data); // Debugging line
      return res.data; // newly created category
    } catch (error) {
      console.error("Create category error:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Create category failed"
      );
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "admin/fetchCategories",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/categories`
      );
      console.log("Fetch categories response data:", res.data); // Debugging line
      return res.data; // array of categories
    } catch (error) {
      console.error("Fetch categories error:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Fetch categories failed"
      );
    }
  }
);

export const createProduct = createAsyncThunk(
  "admin/createProduct",
  async ({ productData, token }, thunkAPI) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/products`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Create product response data:", res.data); // Debugging line
      return res.data; // newly created product
    } catch (error) {
      console.error("Create product error:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Create product failed"
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  "admin/updateProduct",
  async ({ productId, field, value, token }, thunkAPI) => {
    console.log("Updating product:", { productId, field, value }); // Debugging line
    try {
      const res = await axios.patch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/products/${productId}/update-field`,
        { field, value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data.product; // return updated product
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Update product failed"
      );
    }
  }
);

export const createItem = createAsyncThunk(
  "admin/createItem",
  async ({ productId, quantity, token }, thunkAPI) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/items`,
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Create item response data:", res.data); // Debugging line
      return res.data; // newly created items
    } catch (error) {
      console.error("Create item error:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Create item failed"
      );
    }
  }
);

export const fetchItems = createAsyncThunk(
  "admin/fetchItems",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/items`);
      console.log("Fetch items response data:", res.data); // Debugging line
      return res.data; // array of items
    } catch (error) {
      console.error("Fetch items error:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Fetch items failed"
      );
    }
  }
);

export const fetchDashboardStats = createAsyncThunk(
  "admin/fetchDashboardStats",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/stats`);
      console.log("Fetch dashboard stats response data:", res.data); // Debugging line
      return res.data; // dashboard stats
    } catch (error) {
      console.error("Fetch dashboard stats error:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Fetch dashboard stats failed"
      );
    }
  }
);

export const fetchFinishes = createAsyncThunk(
  "admin/fetchFinishes",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/finish`
      );
      console.log("Fetch finishes response data:", res.data); // Debugging line
      return res.data; // array of finishes
    } catch (error) {
      console.error("Fetch finishes error:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Fetch finishes failed"
      );
    }
  }
);

export const createFinish = createAsyncThunk(
  "admin/createFinish",
  async ({ name, token }, thunkAPI) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/finish`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Create finish response data:", res.data); // Debugging line
      return res.data; // newly created finish
    } catch (error) {
      console.error("Create finish error:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Create finish failed"
      );
    }
  }
);

export const deleteFinish = createAsyncThunk(
  "admin/deleteFinish",
  async ({ id, token }, thunkAPI) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/finish/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Delete finish response data:", res.data); // Debugging line
      return id; // return deleted finish id
    } catch (error) {
      console.error("Delete finish error:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Delete finish failed"
      );
    }
  }
);

export const fetchProducts = createAsyncThunk(
  "admin/fetchProducts",
  async (
    { page = 1, limit = 100, search = "", sort = "desc", categoryId },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        sort,
        search,
      });

      if (categoryId && categoryId !== "all") {
        params.append("category", categoryId);
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/products?${params.toString()}`
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    categories: [],
    products: [],
    items: [],
    finishes: [],
    stats: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // i use sort -1 from backend so push at top in redux
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.unshift(action.payload.product);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(
          (prod) => prod._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(...action.payload.items);
      })
      .addCase(createItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;

        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFinishes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFinishes.fulfilled, (state, action) => {
        state.loading = false;
        state.finishes = action.payload;
      })
      .addCase(fetchFinishes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createFinish.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFinish.fulfilled, (state, action) => {
        state.loading = false;
        state.finishes.push(action.payload);
      })
      .addCase(createFinish.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteFinish.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFinish.fulfilled, (state, action) => {
        state.loading = false;
        state.finishes = state.finishes.filter(
          (finish) => finish._id !== action.payload
        );
      })
      .addCase(deleteFinish.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalProducts: action.payload.totalProducts,
        };
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;
