import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { fetchProductsThunk, fetchProductDetailThunk } from "../thunks/productThunks"
import type { ProductState, ProductReadDto } from "../../types/Product"

const initialState: ProductState = {
  products: [],
  product: {} as ProductReadDto,
  loading: false,
  error: null,
  totalPages: 0,
  page: 1,
}

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductsThunk.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload.items
        state.totalPages = action.payload.totalPages
        state.page = action.payload.page
      })
      .addCase(fetchProductsThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    builder
      .addCase(fetchProductDetailThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductDetailThunk.fulfilled, (state, action) => {
        state.loading = false
        state.product = action.payload
      })
      .addCase(fetchProductDetailThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { setPage, clearError } = productSlice.actions
export default productSlice.reducer
