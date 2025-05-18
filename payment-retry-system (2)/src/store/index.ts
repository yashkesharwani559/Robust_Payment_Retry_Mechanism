import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import transactionReducer from "./slices/transactionSlice"
import paymentMethodReducer from "./slices/paymentMethodSlice"
import userReducer from "./slices/userSlice"
import errorLogReducer from "./slices/errorLogSlice"
import analyticsReducer from "./slices/analyticsSlice"
import retryConfigReducer from "./slices/retryConfigSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionReducer,
    paymentMethods: paymentMethodReducer,
    users: userReducer,
    errorLogs: errorLogReducer,
    analytics: analyticsReducer,
    retryConfig: retryConfigReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
