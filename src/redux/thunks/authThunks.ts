import { createAsyncThunk } from "@reduxjs/toolkit";
import { authAPI } from "../../services/api/authAPI";

export const loginUserThunk = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authAPI.login(credentials);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const registerUserThunk = createAsyncThunk(
  "auth/register",
  async (
    data: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      phoneNumber: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await authAPI.register(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const logoutUserThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout();
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);
