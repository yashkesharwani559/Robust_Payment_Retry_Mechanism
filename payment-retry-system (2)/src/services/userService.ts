import api from "./api"
import type { User, PagedResponse } from "@/types"

export const UserService = {
  getCurrentUser: async (): Promise<User> => {
    return api.get("/users/me")
  },

  updateCurrentUser: async (userData: Partial<User>): Promise<User> => {
    return api.put("/users/me", userData)
  },

  getAllUsers: async (page = 0, size = 10): Promise<PagedResponse<User>> => {
    return api.get("/users", { params: { page, size } })
  },

  getUserById: async (id: number): Promise<User> => {
    return api.get(`/users/${id}`)
  },

  updateUser: async (id: number, userData: Partial<User>): Promise<User> => {
    return api.put(`/users/${id}`, userData)
  },

  deleteUser: async (id: number): Promise<void> => {
    return api.delete(`/users/${id}`)
  },
}
