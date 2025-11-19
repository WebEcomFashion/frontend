import { createSlice } from "@reduxjs/toolkit";
import {
  loginUserThunk,
  registerUserThunk,
  logoutUserThunk,
} from "../thunks/authThunks";
import type { AuthState } from "../../types/Auth";
import createStore from "react-auth-kit/createStore";

const getRoleName = (roleNumber: number | string): string => {
  const role =
    typeof roleNumber === "string" ? Number.parseInt(roleNumber) : roleNumber;
  switch (role) {
    case 1:
      return "Admin";
    case 2:
      return "User";
    default:
      return "User";
  }
};

const initialState: AuthState = {
  token: localStorage.getItem("token") || "",
  authenticated: !!localStorage.getItem("token"),
  error: null,
  loading: false,
  userId: Number(localStorage.getItem("userId")) || null,
  userRole: localStorage.getItem("userRole") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.authenticated = true;
        state.token = action.payload.token;
        state.userId = action.payload.userId;
        state.userRole = getRoleName(action.payload.userRole);
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("userId", action.payload.userId);
        localStorage.setItem("userRole", getRoleName(action.payload.userRole));
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.authenticated = false;
      });

    // Register
    builder
      .addCase(registerUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.authenticated = true;
        state.token = action.payload.token;
        state.userId = action.payload.userId;
        state.userRole = getRoleName(action.payload.userRole);
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("userId", action.payload.userId);
        localStorage.setItem("userRole", getRoleName(action.payload.userRole));
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder.addCase(logoutUserThunk.fulfilled, (state) => {
      state.authenticated = false;
      state.token = "";
      state.userId = null;
      state.userRole = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("userRole");
    });
  },
});

export const { clearError } = authSlice.actions;

export const authStore = createStore({
  authName: "_auth",
  authType: "localstorage",
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === "https:",
});

export default authSlice.reducer;
