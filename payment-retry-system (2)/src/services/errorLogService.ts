import api from "./api"
import type { ErrorLog, PagedResponse } from "@/types"

export const ErrorLogService = {
  getErrorLogs: async (
    errorCode?: string,
    startDate?: string,
    endDate?: string,
    page = 0,
    size = 10,
  ): Promise<PagedResponse<ErrorLog>> => {
    return api.get("/api/error-logs", {
      params: { errorCode, startDate, endDate, page, size },
    })
  },

  getMostCommonErrorCodes: async (limit = 5): Promise<any[]> => {
    return api.get("/api/error-logs/common", { params: { limit } })
  },
}
