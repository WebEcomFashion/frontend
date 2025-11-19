import { createSlice } from "@reduxjs/toolkit"
import { fetchUserProfileThunk, updateUserProfileThunk } from "../thunks/userThunks"
import type { UserReadDto } from "../../types/User"

interface UserState {
  user: UserReadDto | null
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfileThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserProfileThunk.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(fetchUserProfileThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    builder
      .addCase(updateUserProfileThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUserProfileThunk.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(updateUserProfileThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError } = userSlice.actions
export default userSlice.reducer
