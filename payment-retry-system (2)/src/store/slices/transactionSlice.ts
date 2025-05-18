import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { TransactionService } from "@/services/transactionService"
import type { Transaction, TransactionRequest } from "@/types"

interface TransactionState {
  transactions: Transaction[]
  currentTransaction: Transaction | null
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

const initialState: TransactionState = {
  transactions: [],
  currentTransaction: null,
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
export const fetchUserTransactions = createAsyncThunk(
  "transactions/fetchUserTransactions",
  async ({ status, page, size }: { status?: string; page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await TransactionService.getUserTransactions(status, page, size)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch transactions")
    }
  },
)

export const fetchAllTransactions = createAsyncThunk(
  "transactions/fetchAllTransactions",
  async (
    { status, userId, page, size }: { status?: string; userId?: number; page?: number; size?: number },
    { rejectWithValue },
  ) => {
    try {
      const response = await TransactionService.getAllTransactions(status, userId, page, size)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch transactions")
    }
  },
)

export const fetchTransactionById = createAsyncThunk(
  "transactions/fetchTransactionById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await TransactionService.getTransactionById(id)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch transaction")
    }
  },
)

export const createTransaction = createAsyncThunk(
  "transactions/createTransaction",
  async (transaction: TransactionRequest, { rejectWithValue }) => {
    try {
      const response = await TransactionService.createTransaction(transaction)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create transaction")
    }
  },
)

export const retryTransaction = createAsyncThunk(
  "transactions/retryTransaction",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await TransactionService.retryTransaction(id)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to retry transaction")
    }
  },
)

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    clearCurrentTransaction: (state) => {
      state.currentTransaction = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Transactions
      .addCase(fetchUserTransactions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserTransactions.fulfilled, (state, action) => {
        state.loading = false
        state.transactions = action.payload.content
        state.pagination = {
          page: action.payload.page,
          size: action.payload.size,
          totalItems: action.payload.totalElements,
          totalPages: action.payload.totalPages,
          isLast: action.payload.last,
        }
      })
      .addCase(fetchUserTransactions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Fetch All Transactions (Admin)
      .addCase(fetchAllTransactions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllTransactions.fulfilled, (state, action) => {
        state.loading = false
        state.transactions = action.payload.content
        state.pagination = {
          page: action.payload.page,
          size: action.payload.size,
          totalItems: action.payload.totalElements,
          totalPages: action.payload.totalPages,
          isLast: action.payload.last,
        }
      })
      .addCase(fetchAllTransactions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Fetch Transaction By ID
      .addCase(fetchTransactionById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTransactionById.fulfilled, (state, action) => {
        state.loading = false
        state.currentTransaction = action.payload
      })
      .addCase(fetchTransactionById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Create Transaction
      .addCase(createTransaction.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false
        state.currentTransaction = action.payload
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Retry Transaction
      .addCase(retryTransaction.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(retryTransaction.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(retryTransaction.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearCurrentTransaction } = transactionSlice.actions
export default transactionSlice.reducer
