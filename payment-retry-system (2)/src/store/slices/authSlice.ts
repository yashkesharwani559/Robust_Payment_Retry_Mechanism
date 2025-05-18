import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { AuthService } from "@/services/authService"
import type { User, LoginRequest, RegisterRequest, AuthResponse } from "@/types"

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem("token"),
  loading: false,
  error: null,
}

// Async thunks
export const login = createAsyncThunk("auth/login", async (credentials: LoginRequest, { rejectWithValue }) => {
  try {
    const response = await AuthService.login(credentials)
    return response
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Login failed")
  }
})

export const register = createAsyncThunk("auth/register", async (userData: RegisterRequest, { rejectWithValue }) => {
  try {
    const response = await AuthService.register(userData)
    return response
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Registration failed")
  }
})

export const refreshUser = createAsyncThunk("auth/refreshUser", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token")
    if (!token) {
      throw new Error("No token found")
    }

    const userData = localStorage.getItem("user")
    if (!userData) {
      throw new Error("No user data found")
    }

    return JSON.parse(userData) as User
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to refresh user")
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
      state.token = null
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    },
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      const { token, name, email, phone, role } = action.payload
      state.isAuthenticated = true
      state.token = token
      state.user = { name, email, phone, role }

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify({ name, email, phone, role }))
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.token = action.payload.token
        state.user = {
          name: action.payload.name,
          email: action.payload.email,
          phone: action.payload.phone,
          role: action.payload.role,
        }

        localStorage.setItem("token", action.payload.token)
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: action.payload.name,
            email: action.payload.email,
            phone: action.payload.phone,
            role: action.payload.role,
          }),
        )
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Register
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.token = action.payload.token
        state.user = {
          name: action.payload.name,
          email: action.payload.email,
          phone: action.payload.phone,
          role: action.payload.role,
        }

        localStorage.setItem("token", action.payload.token)
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: action.payload.name,
            email: action.payload.email,
            phone: action.payload.phone,
            role: action.payload.role,
          }),
        )
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Refresh User
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.user = action.payload
      })
      .addCase(refreshUser.rejected, (state) => {
        state.isAuthenticated = false
        state.user = null
        state.token = null
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      })
  },
})

export const { logout, setCredentials } = authSlice.actions
export default authSlice.reducer
