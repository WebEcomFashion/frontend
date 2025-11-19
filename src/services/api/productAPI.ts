import axios from "axios"
import { base_localhost_URL } from "../../types/Auth"

const API_URL = `${base_localhost_URL}/products`

export const productAPI = {
  getProducts: async (page = 1, perPage = 10) => {
    const response = await axios.get(`${API_URL}?page=${page}&perPage=${perPage}`)
    return response.data
  },

  getProductById: async (id: number) => {
    const response = await axios.get(`${API_URL}/${id}`)
    return response.data
  },

  createProduct: async (data: any) => {
    const response = await axios.post(API_URL, data)
    return response.data
  },

  updateProduct: async (id: number, data: any) => {
    const response = await axios.put(`${API_URL}/${id}`, data)
    return response.data
  },

  deleteProduct: async (id: number) => {
    const response = await axios.delete(`${API_URL}/${id}`)
    return response.data
  },

  getBestSellers: async (limit = 4) => {
    const response = await axios.get(`${API_URL}/best-sellers?limit=${limit}`)
    return response.data
  },
}
