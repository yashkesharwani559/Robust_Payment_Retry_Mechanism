import api from "./api"
import type { LoginRequest, RegisterRequest, AuthResponse } from "@/types"

export const AuthService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    return api.post("/api/auth/login", credentials)
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    return api.post("/api/auth/register", userData)
  },
}
