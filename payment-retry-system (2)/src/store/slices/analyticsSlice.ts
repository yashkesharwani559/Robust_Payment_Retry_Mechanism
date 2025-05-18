import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { AnalyticsService } from "@/services/analyticsService"

interface TransactionTrend {
  date: string
  successful: number
  failed: number
  total: number
}

interface ErrorCodeCount {
  errorCode: string
  count: number
}

interface TransactionSummary {
  id: number
  status: string
  currency: string
  amount: number
  createdAt: string
  paymentMethodName: string
  retryAttempts: number
  maxRetries: number
}

interface AnalyticsState {
  transactionTrend: TransactionTrend[]
  retrySuccessRate: number | null
  commonErrorCodes: ErrorCodeCount[]
  transactionSummaries: TransactionSummary[]
  averageRetryAttempts: number | null
  loading: boolean
  error: string | null
}

const initialState: AnalyticsState = {
  transactionTrend: [],
  retrySuccessRate: null,
  commonErrorCodes: [],
  transactionSummaries: [],
  averageRetryAttempts: null,
  loading: false,
  error: null,
}

// Async thunks
export const fetchTransactionTrend = createAsyncThunk(
  "analytics/fetchTransactionTrend",
  async (days = 7, { rejectWithValue }) => {
    try {
      const response = await AnalyticsService.getTransactionTrend(days)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch transaction trend")
    }
  },
)

export const fetchRetrySuccessRate = createAsyncThunk(
  "analytics/fetchRetrySuccessRate",
  async (_, { rejectWithValue }) => {
    try {
      const response = await AnalyticsService.getRetrySuccessRate()
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch retry success rate")
    }
  },
)

export const fetchCommonErrorCodes = createAsyncThunk(
  "analytics/fetchCommonErrorCodes",
  async (limit = 5, { rejectWithValue }) => {
    try {
      const response = await AnalyticsService.getMostCommonErrors(limit)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch common error codes")
    }
  },
)

export const fetchTransactionSummaries = createAsyncThunk(
  "analytics/fetchTransactionSummaries",
  async (limit = 10, { rejectWithValue }) => {
    try {
      const response = await AnalyticsService.getTransactionSummary(limit)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch transaction summaries")
    }
  },
)

export const fetchAverageRetryAttempts = createAsyncThunk(
  "analytics/fetchAverageRetryAttempts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await AnalyticsService.getAverageAttemptsForSuccess()
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch average retry attempts")
    }
  },
)

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Transaction Trend
      .addCase(fetchTransactionTrend.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTransactionTrend.fulfilled, (state, action) => {
        state.loading = false
        state.transactionTrend = action.payload
      })
      .addCase(fetchTransactionTrend.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Fetch Retry Success Rate
      .addCase(fetchRetrySuccessRate.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRetrySuccessRate.fulfilled, (state, action) => {
        state.loading = false
        state.retrySuccessRate = action.payload
      })
      .addCase(fetchRetrySuccessRate.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Fetch Common Error Codes
      .addCase(fetchCommonErrorCodes.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCommonErrorCodes.fulfilled, (state, action) => {
        state.loading = false
        state.commonErrorCodes = action.payload
      })
      .addCase(fetchCommonErrorCodes.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Fetch Transaction Summaries
      .addCase(fetchTransactionSummaries.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTransactionSummaries.fulfilled, (state, action) => {
        state.loading = false
        state.transactionSummaries = action.payload
      })
      .addCase(fetchTransactionSummaries.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Fetch Average Retry Attempts
      .addCase(fetchAverageRetryAttempts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAverageRetryAttempts.fulfilled, (state, action) => {
        state.loading = false
        state.averageRetryAttempts = action.payload
      })
      .addCase(fetchAverageRetryAttempts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default analyticsSlice.reducer
