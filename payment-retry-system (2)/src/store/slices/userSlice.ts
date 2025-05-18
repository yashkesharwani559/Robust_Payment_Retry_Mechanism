import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { UserService } from "@/services/userService"
import type { User } from "@/types"

interface UserState {
  users: User[]
  currentUser: User | null
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

const initialState: UserState = {
  users: [],
  currentUser: null,
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
export const fetchCurrentUser = createAsyncThunk("users/fetchCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const response = await UserService.getCurrentUser()
    return response
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch current user")
  }
})

export const updateCurrentUser = createAsyncThunk(
  "users/updateCurrentUser",
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await UserService.updateCurrentUser(userData)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update user")
    }
  },
)

export const fetchAllUsers = createAsyncThunk(
  "users/fetchAllUsers",
  async ({ page, size }: { page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await UserService.getAllUsers(page, size)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch users")
    }
  },
)

export const fetchUserById = createAsyncThunk("users/fetchUserById", async (id: number, { rejectWithValue }) => {
  try {
    const response = await UserService.getUserById(id)
    return response
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch user")
  }
})

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, userData }: { id: number; userData: Partial<User> }, { rejectWithValue }) => {
    try {
      const response = await UserService.updateUser(id, userData)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update user")
    }
  },
)

export const deleteUser = createAsyncThunk("users/deleteUser", async (id: number, { rejectWithValue }) => {
  try {
    await UserService.deleteUser(id)
    return id
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete user")
  }
})

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearCurrentUser: (state) => {
      state.currentUser = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Current User
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false
        state.currentUser = action.payload
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Update Current User
      .addCase(updateCurrentUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateCurrentUser.fulfilled, (state, action) => {
        state.loading = false
        state.currentUser = action.payload
      })
      .addCase(updateCurrentUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Fetch All Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload.content
        state.pagination = {
          page: action.payload.page,
          size: action.payload.size,
          totalItems: action.payload.totalElements,
          totalPages: action.payload.totalPages,
          isLast: action.payload.last,
        }
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Fetch User By ID
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false
        state.currentUser = action.payload
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false
        state.users = state.users.map((user) => (user.id === action.payload.id ? action.payload : user))
        state.currentUser = action.payload
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false
        state.users = state.users.filter((user) => user.id !== action.payload)
        if (state.currentUser?.id === action.payload) {
          state.currentUser = null
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearCurrentUser } = userSlice.actions
export default userSlice.reducer
