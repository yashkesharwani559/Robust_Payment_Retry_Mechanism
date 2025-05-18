import api from "./api"

export const AnalyticsService = {
  getTransactionTrend: async (days = 7): Promise<any[]> => {
    return api.get("/api/analytics/transactions/trend", { params: { days } })
  },

  getRetrySuccessRate: async (): Promise<number> => {
    return api.get("/api/analytics/retry/success-rate")
  },

  getMostCommonErrors: async (limit = 5): Promise<any[]> => {
    return api.get("/api/analytics/errors/common", { params: { limit } })
  },

  getTransactionSummary: async (limit = 10): Promise<any[]> => {
    return api.get("/api/analytics/transactions/summary", { params: { limit } })
  },

  getAverageAttemptsForSuccess: async (): Promise<number> => {
    return api.get("/api/analytics/retry/avg-attempts")
  },
}
