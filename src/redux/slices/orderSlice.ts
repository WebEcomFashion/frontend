import { createSlice } from "@reduxjs/toolkit"
import { fetchUserOrdersThunk, createOrderThunk } from "../thunks/orderThunks"
import type { Order } from "../../types/Order"

interface OrderState {
  orders: Order[]
  loading: boolean
  error: string | null
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
}

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrdersThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserOrdersThunk.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload
      })
      .addCase(fetchUserOrdersThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    builder
      .addCase(createOrderThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.loading = false
        state.orders.push(action.payload)
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError } = orderSlice.actions
export default orderSlice.reducer
