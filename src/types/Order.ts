export interface OrderItem {
  productId: number
  productTitle: string
  quantity: number
  unitPrice: number
  size?: string
  color?: string
}

export interface OrderCreateDto {
  userId: number
  items: OrderItem[]
  totalAmount: number
  shippingAddress: ShippingAddress
  paymentMethod: "card" | "paypal" | "bank_transfer"
  status: "pending" | "processing" | "completed" | "cancelled"
}

export interface OrderReadDto extends OrderCreateDto {
  id: number
  createdAt: string
  updatedAt: string
  paymentId?: string
}

export interface ShippingAddress {
  fullName: string
  email: string
  phone: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface PaymentCreateDto {
  orderId: number
  amount: number
  currency: string
  paymentMethod: string
  cardToken?: string
}

export interface PaymentReadDto extends PaymentCreateDto {
  id: number
  status: "pending" | "completed" | "failed"
  transactionId?: string
  createdAt: string
}
