import api from "./api"
import type { PaymentMethod, PaymentMethodRequest } from "@/types"

export const PaymentMethodService = {
  getUserPaymentMethods: async (): Promise<PaymentMethod[]> => {
    return api.get("/payment-methods")
  },

  getPaymentMethodById: async (id: number): Promise<PaymentMethod> => {
    return api.get(`/payment-methods/${id}`)
  },

  createPaymentMethod: async (paymentMethod: PaymentMethodRequest): Promise<PaymentMethod> => {
    return api.post("/payment-methods", paymentMethod)
  },

  updatePaymentMethod: async (id: number, paymentMethod: PaymentMethodRequest): Promise<PaymentMethod> => {
    return api.put(`/payment-methods/${id}`, paymentMethod)
  },

  deletePaymentMethod: async (id: number): Promise<void> => {
    return api.delete(`/payment-methods/${id}`)
  },
}
