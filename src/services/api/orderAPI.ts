import axios from "axios";
import { base_localhost_URL } from "../../types/Auth";

const API_URL = `${base_localhost_URL}/orders`;

export const orderAPI = {
  getUserOrders: async (userId: number) => {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data;
  },

  getOrderById: async (orderId: number) => {
    const response = await axios.get(`${API_URL}/${orderId}`);
    return response.data;
  },

  createOrder: async (data: any) => {
    const response = await axios.post(API_URL, data);
    return response.data;
  },

  // ✅ Sửa ở đây
  updateOrderStatus: async (
    orderId: number,
    status: string,
    extraData?: any
  ) => {
    const response = await axios.patch(`${API_URL}/${orderId}`, {
      status,
      ...extraData,
    });
    return response.data;
  },
};
