import axios from "axios"
import { base_localhost_URL } from "../../types/Auth"

const API_URL = `${base_localhost_URL}/Admin`

const getAuthHeader = () => {
  const token = localStorage.getItem("token")
  return {
    Authorization: `Bearer ${token}`,
  }
}

export const adminAPI = {
  getDashboardStats: async () => {
    const response = await axios.get(`${API_URL}/dashboard`, {
      headers: getAuthHeader(),
    })
    return response.data
  },

  getAllUsers: async (page = 1, perPage = 10) => {
    const response = await axios.get(`${API_URL}/users?page=${page}&perPage=${perPage}`, {
      headers: getAuthHeader(),
    })
    return response.data
  },

  getAllOrders: async (page = 1, perPage = 10) => {
    const response = await axios.get(`${API_URL}/orders?page=${page}&perPage=${perPage}`, {
      headers: getAuthHeader(),
    })
    return response.data
  },

  updateOrderStatus: async (orderId: number, status: string) => {
    const response = await axios.patch(
      `${API_URL}/orders/${orderId}/status`,
      { Status: status }, // Changed from 'status' to 'Status'
      {
        headers: getAuthHeader(),
      },
    )
    return response.data
  },

  getAllProducts: async (page = 1, perPage = 10) => {
    const response = await axios.get(`${base_localhost_URL}/Admin/products?page=${page}&perPage=${perPage}`, {
      headers: getAuthHeader(),
    })
    return response.data
  },

  createProduct: async (data: any) => {
    const response = await axios.post(`${base_localhost_URL}/Admin/products`, data, {
      headers: getAuthHeader(),
    })
    return response.data
  },

  updateProduct: async (id: number, data: any) => {
    const response = await axios.put(`${base_localhost_URL}/Admin/products/${id}`, data, {
      headers: getAuthHeader(),
    })
    return response.data
  },

  deleteProduct: async (productId: number) => {
    const response = await axios.delete(`${base_localhost_URL}/Admin/products/${productId}`, {
      headers: getAuthHeader(),
    })
    return response.data
  },

  deleteUser: async (userId: number) => {
    const response = await axios.delete(`${API_URL}/users/${userId}`, {
      headers: getAuthHeader(),
    })
    return response.data
  },

  updateUser: async (userId: number, data: any) => {
    const response = await axios.put(`${API_URL}/users/${userId}`, data, {
      headers: getAuthHeader(),
    })
    return response.data
  },
}
