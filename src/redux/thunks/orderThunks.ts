import { createAsyncThunk } from "@reduxjs/toolkit"
import { orderAPI } from "../../services/api/orderAPI"

export const fetchUserOrdersThunk = createAsyncThunk(
  "orders/fetchUserOrders",
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await orderAPI.getUserOrders(userId)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch orders")
    }
  },
)

export const createOrderThunk = createAsyncThunk("orders/create", async (orderData: any, { rejectWithValue }) => {
  try {
    const response = await orderAPI.createOrder(orderData)
    return response
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to create order")
  }
})
