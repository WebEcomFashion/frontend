import { createAsyncThunk } from "@reduxjs/toolkit";
import { productAPI } from "../../services/api/productAPI";

export const fetchProductsThunk = createAsyncThunk(
  "products/fetchAll",
  async (
    { page = 1, perPage = 10 }: { page?: number; perPage?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await productAPI.getProducts(page, perPage);
      console.log("Products from API:", response);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

export const fetchProductDetailThunk = createAsyncThunk(
  "products/fetchDetail",
  async (productId: number, { rejectWithValue }) => {
    try {
      const response = await productAPI.getProductById(productId);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product"
      );
    }
  }
);

export const fetchBestSellersThunk = createAsyncThunk(
  "products/fetchBestSellers",
  async (
    { limit = 4 }: { limit?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await productAPI.getBestSellers(limit);
      console.log("Best Sellers from API:", response);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch best sellers"
      );
    }
  }
);
