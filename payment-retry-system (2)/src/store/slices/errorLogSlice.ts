import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { ErrorLogService } from "@/services/errorLogService"
import type { ErrorLog } from "@/types"

interface ErrorLogState {
  errorLogs: ErrorLog[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    size: number
    totalItems: number
    totalPages: number
    isLast: boolean
  }
}

const initialState: ErrorLogState = {
  errorLogs: [],
  loading: false,
  error: null,
  pagination: {
    page: 0,
    size: 10,
    totalItems: 0,
    totalPages: 0,
    isLast: true,
  },
}

// Async thunks
export const fetchErrorLogs = createAsyncThunk(
  "errorLogs/fetchErrorLogs",
  async (
    {
      errorCode,
      startDate,
      endDate,
      page,
      size,
    }: {
      errorCode?: string
      startDate?: string
      endDate?: string
      page?: number
      size?: number
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await ErrorLogService.getErrorLogs(errorCode, startDate, endDate, page, size)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch error logs")
    }
  },
)

export const fetchMostCommonErrorCodes = createAsyncThunk(
  "errorLogs/fetchMostCommonErrorCodes",
  async (limit = 5, { rejectWithValue }) => {
    try {
      const response = await ErrorLogService.getMostCommonErrorCodes(limit)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch common error codes")
    }
  },
)

const errorLogSlice = createSlice({
  name: "errorLogs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Error Logs
      .addCase(fetchErrorLogs.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchErrorLogs.fulfilled, (state, action) => {
        state.loading = false
        state.errorLogs = action.payload.content
        state.pagination = {
          page: action.payload.page,
          size: action.payload.size,
          totalItems: action.payload.totalElements,
          totalPages: action.payload.totalPages,
          isLast: action.payload.last,
        }
      })
      .addCase(fetchErrorLogs.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Fetch Most Common Error Codes
      .addCase(fetchMostCommonErrorCodes.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMostCommonErrorCodes.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(fetchMostCommonErrorCodes.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default errorLogSlice.reducer
