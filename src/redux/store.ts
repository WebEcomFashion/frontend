import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import productReducer from "./slices/productSlice"
import cartReducer from "./slices/cartSlice"
import orderReducer from "./slices/orderSlice"
import userReducer from "./slices/userSlice"

export const store = configureStore({
  reducer: {
    authR: authReducer,
    productR: productReducer,
    cartR: cartReducer,
    orderR: orderReducer,
    userR: userReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
