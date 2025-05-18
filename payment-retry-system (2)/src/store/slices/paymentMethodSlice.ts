import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { PaymentMethodService } from "@/services/paymentMethodService"
import type { PaymentMethod, PaymentMethodRequest } from "@/types"

interface PaymentMethodState {
  paymentMethods: PaymentMethod[]
  currentPaymentMethod: PaymentMethod | null
  loading: boolean
  error: string | null
}

const initialState: PaymentMethodState = {
  paymentMethods: [],
  currentPaymentMethod: null,
  loading: false,
  error: null,
}

// Async thunks
export const fetchPaymentMethods = createAsyncThunk(
  "paymentMethods/fetchPaymentMethods",
  async (_, { rejectWithValue }) => {
    try {
      const response = await PaymentMethodService.getUserPaymentMethods()
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch payment methods")
    }
  },
)

export const fetchPaymentMethodById = createAsyncThunk(
  "paymentMethods/fetchPaymentMethodById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await PaymentMethodService.getPaymentMethodById(id)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch payment method")
    }
  },
)

export const createPaymentMethod = createAsyncThunk(
  "paymentMethods/createPaymentMethod",
  async (paymentMethod: PaymentMethodRequest, { rejectWithValue }) => {
    try {
      const response = await PaymentMethodService.createPaymentMethod(paymentMethod)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create payment method")
    }
  },
)

export const updatePaymentMethod = createAsyncThunk(
  "paymentMethods/updatePaymentMethod",
  async ({ id, paymentMethod }: { id: number; paymentMethod: PaymentMethodRequest }, { rejectWithValue }) => {
    try {
      const response = await PaymentMethodService.updatePaymentMethod(id, paymentMethod)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update payment method")
    }
  },
)

export const deletePaymentMethod = createAsyncThunk(
  "paymentMethods/deletePaymentMethod",
  async (id: number, { rejectWithValue }) => {
    try {
      await PaymentMethodService.deletePaymentMethod(id)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete payment method")
    }
  },
)

const paymentMethodSlice = createSlice({
  name: "paymentMethods",
  initialState,
  reducers: {
    clearCurrentPaymentMethod: (state) => {
      state.currentPaymentMethod = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Payment Methods
      .addCase(fetchPaymentMethods.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
        state.loading = false
        state.paymentMethods = action.payload
      })
      .addCase(fetchPaymentMethods.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Fetch Payment Method By ID
      .addCase(fetchPaymentMethodById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPaymentMethodById.fulfilled, (state, action) => {
        state.loading = false
        state.currentPaymentMethod = action.payload
      })
      .addCase(fetchPaymentMethodById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Create Payment Method
      .addCase(createPaymentMethod.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createPaymentMethod.fulfilled, (state, action) => {
        state.loading = false
        state.paymentMethods = [...state.paymentMethods, action.payload]
      })
      .addCase(createPaymentMethod.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Update Payment Method
      .addCase(updatePaymentMethod.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updatePaymentMethod.fulfilled, (state, action) => {
        state.loading = false
        state.paymentMethods = state.paymentMethods.map((method) =>
          method.id === action.payload.id ? action.payload : method,
        )
        state.currentPaymentMethod = action.payload
      })
      .addCase(updatePaymentMethod.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Delete Payment Method
      .addCase(deletePaymentMethod.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deletePaymentMethod.fulfilled, (state, action) => {
        state.loading = false
        state.paymentMethods = state.paymentMethods.filter((method) => method.id !== action.payload)
        if (state.currentPaymentMethod?.id === action.payload) {
          state.currentPaymentMethod = null
        }
      })
      .addCase(deletePaymentMethod.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearCurrentPaymentMethod } = paymentMethodSlice.actions
export default paymentMethodSlice.reducer
