import { createAsyncThunk } from "@reduxjs/toolkit";
import { userAPI } from "../../services/api/userAPI";

export const fetchUserProfileThunk = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userAPI.getUserProfile();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

export const updateUserProfileThunk = createAsyncThunk(
  "user/updateProfile",
  async (
    data: {
      userId: number;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await userAPI.updateUserProfile(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

export const changePasswordThunk = createAsyncThunk(
  "user/changePassword",
  async (
    data: {
      userId: number;
      oldPassword: string;
      newPassword: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await userAPI.changePassword(
        data.userId,
        data.oldPassword,
        data.newPassword
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to change password"
      );
    }
  }
);
