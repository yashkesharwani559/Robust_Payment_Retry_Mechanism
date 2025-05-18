import api from "./api"
import type { Transaction, TransactionRequest, PagedResponse, MessageResponse } from "@/types"

export const TransactionService = {
  createTransaction: async (transaction: TransactionRequest): Promise<Transaction> => {
    return api.post("/transactions", transaction)
  },

  getUserTransactions: async (status?: string, page = 0, size = 10): Promise<PagedResponse<Transaction>> => {
    return api.get("/transactions", { params: { status, page, size } })
  },

  getTransactionById: async (id: number): Promise<Transaction> => {
    return api.get(`/transactions/${id}`)
  },

  retryTransaction: async (id: number): Promise<MessageResponse> => {
    return api.put(`/transactions/${id}/retry`)
  },

  getAllTransactions: async (
    status?: string,
    userId?: number,
    page = 0,
    size = 10,
  ): Promise<PagedResponse<Transaction>> => {
    return api.get("/transactions/all", { params: { status, userId, page, size } })
  },
}
