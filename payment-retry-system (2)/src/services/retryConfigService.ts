import api from "./api"
import type { RetryConfig, RetryConfigRequest } from "@/types"

export const RetryConfigService = {
  getGlobalRetryConfig: async (): Promise<RetryConfig> => {
    return api.get("/api/retry-config/global")
  },

  updateGlobalRetryConfig: async (config: RetryConfigRequest): Promise<RetryConfig> => {
    return api.put("/api/retry-config/global", config)
  },

  updateTransactionRetryConfig: async (txId: number, config: RetryConfigRequest): Promise<RetryConfig> => {
    return api.put(`/api/retry-config/transaction/${txId}`, config)
  },
}
