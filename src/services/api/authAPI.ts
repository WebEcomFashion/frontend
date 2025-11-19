import axios from "axios";
import { base_localhost_URL } from "../../types/Auth";

const API_URL = `${base_localhost_URL}/auth`;

export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return {
      token: response.data.token,
      userId: response.data.userId,
      userRole: response.data.userRole,
    };
  },

  register: async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
  }) => {
    const response = await axios.post(`${API_URL}/register`, {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      phoneNumber: data.phoneNumber,
    });
    // Backend returns UserDto, extract token and userId from response
    return {
      token: response.data.token || "",
      userId: response.data.id,
      userRole: response.data.role || 2,
    };
  },

  logout: async () => {
    return await axios.post(`${API_URL}/logout`);
  },
};
