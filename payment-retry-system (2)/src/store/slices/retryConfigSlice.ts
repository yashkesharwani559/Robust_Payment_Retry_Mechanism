import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { RetryConfigService } from "@/services/retryConfigService"
import type { RetryConfig, RetryConfigRequest } from "@/types"

interface RetryConfigState {
  globalConfig: RetryConfig | null
  loading: boolean
  error: string | null
}

const initialState: RetryConfigState = {
  globalConfig: null,
  loading: false,
  error: null,
}

// Async thunks
export const fetchGlobalRetryConfig = createAsyncThunk(
  "retryConfig/fetchGlobalRetryConfig",
  async (_, { rejectWithValue }) => {
    try {
      const response = await RetryConfigService.getGlobalRetryConfig()
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch global retry config")
    }
  },
)

export const updateGlobalRetryConfig = createAsyncThunk(
  "retryConfig/updateGlobalRetryConfig",
  async (config: RetryConfigRequest, { rejectWithValue }) => {
    try {
      const response = await RetryConfigService.updateGlobalRetryConfig(config)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update global retry config")
    }
  },
)

export const updateTransactionRetryConfig = createAsyncThunk(
  "retryConfig/updateTransactionRetryConfig",
  async ({ txId, config }: { txId: number; config: RetryConfigRequest }, { rejectWithValue }) => {
    try {
      const response = await RetryConfigService.updateTransactionRetryConfig(txId, config)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update transaction retry config")
    }
  },
)

const retryConfigSlice = createSlice({
  name: "retryConfig",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Global Retry Config
      .addCase(fetchGlobalRetryConfig.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchGlobalRetryConfig.fulfilled, (state, action) => {
        state.loading = false
        state.globalConfig = action.payload
      })
      .addCase(fetchGlobalRetryConfig.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Update Global Retry Config
      .addCase(updateGlobalRetryConfig.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateGlobalRetryConfig.fulfilled, (state, action) => {
        state.loading = false
        state.globalConfig = action.payload
      })
      .addCase(updateGlobalRetryConfig.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Update Transaction Retry Config
      .addCase(updateTransactionRetryConfig.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateTransactionRetryConfig.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(updateTransactionRetryConfig.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default retryConfigSlice.reducer
