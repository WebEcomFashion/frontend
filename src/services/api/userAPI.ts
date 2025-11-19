import axios from "axios";
import { base_localhost_URL } from "../../types/Auth";

const API_URL = `${base_localhost_URL}/users`;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const userAPI = {
  getUserProfile: async () => {
    const response = await axios.get(`${API_URL}/profile`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  updateUserProfile: async (data: any) => {
    const response = await axios.put(
      `${API_URL}/${data.userId}`,
      {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
      },
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  },

  changePassword: async (
    userId: number,
    oldPassword: string,
    newPassword: string
  ) => {
    const response = await axios.post(
      `${API_URL}/${userId}/change-password`,
      {
        oldPassword,
        newPassword,
      },
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  },
};
