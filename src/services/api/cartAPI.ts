import axios from "axios"
import { base_localhost_URL } from "../../types/Auth"

const API_URL = `${base_localhost_URL}/carts`

export const cartAPI = {
  getCart: async (cartId: number) => {
    const response = await axios.get(`${API_URL}/${cartId}`)
    return response.data
  },

  createCart: async (userId: number) => {
    const response = await axios.post(API_URL, { userId })
    return response.data
  },

  updateCart: async (cartId: number, totalPrice: number) => {
    const response = await axios.put(`${API_URL}/${cartId}`, { totalPrice })
    return response.data
  },

  deleteCart: async (cartId: number) => {
    const response = await axios.delete(`${API_URL}/${cartId}`)
    return response.data
  },

  addCartItem: async (cartId: number, item: any) => {
    const response = await axios.post(`${API_URL}/${cartId}/items`, item)
    return response.data
  },
}
