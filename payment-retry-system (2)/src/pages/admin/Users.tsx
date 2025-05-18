"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store"
import { fetchAllUsers, updateUser, deleteUser } from "@/store/slices/userSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Search, Edit, Trash2, Check, X } from "lucide-react"
import type { User } from "@/types"

const Users = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { users, loading, pagination, error } = useSelector((state: RootState) => state.users)
  const { toast } = useToast()

  const [searchTerm, setSearchTerm] = useState("")
  const [editingUserId, setEditingUserId] = useState<number | null>(null)
  const [editFormData, setEditFormData] = useState<Partial<User>>({
    name: "",
    email: "",
    phone: "",
    enabled: true,
  })

  useEffect(() => {
    dispatch(fetchAllUsers({ page: 0, size: 10 }))
  }, [dispatch])

  const handlePageChange = (page: number) => {
    dispatch(fetchAllUsers({ page, size: pagination.size }))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality here
    // This would typically filter users based on the search term
    toast({
      title: "Search",
      description: `Searching for "${searchTerm}"`,
    })
  }

  const handleEdit = (user: User) => {
    if (user.id) {
      setEditingUserId(user.id)
      setEditFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        enabled: user.enabled,
      })
    }
  }

  const handleCancelEdit = () => {
    setEditingUserId(null)
    setEditFormData({
      name: "",
      email: "",
      phone: "",
      enabled: true,
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setEditFormData({
      ...editFormData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSaveEdit = async () => {
    if (!editingUserId) return

    try {
      await dispatch(updateUser({ id: editingUserId, userData: editFormData })).unwrap()
      toast({
        title: "User Updated",
        description: "User information has been updated successfully.",
      })
      setEditingUserId(null)
    } catch (err) {
      toast({
        title: "Update Failed",
        description: error || "Failed to update user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await dispatch(deleteUser(id)).unwrap()
        toast({
          title: "User Deleted",
          description: "User has been deleted successfully.",
        })
      } catch (err) {
        toast({
          title: "Delete Failed",
          description: error || "Failed to delete user. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Users</h1>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>View and manage system users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button type="submit">Search</Button>
            </form>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Name</th>
                    <th className="text-left py-3 px-4 font-medium">Email</th>
                    <th className="text-left py-3 px-4 font-medium">Phone</th>
                    <th className="text-left py-3 px-4 font-medium">Role</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-3 px-4">
                        {editingUserId === user.id ? (
                          <Input
                            name="name"
                            value={editFormData.name}
                            onChange={handleInputChange}
                            className="max-w-[200px]"
                          />
                        ) : (
                          user.name
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {editingUserId === user.id ? (
                          <Input
                            name="email"
                            type="email"
                            value={editFormData.email}
                            onChange={handleInputChange}
                            className="max-w-[200px]"
                          />
                        ) : (
                          user.email
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {editingUserId === user.id ? (
                          <Input
                            name="phone"
                            value={editFormData.phone}
                            onChange={handleInputChange}
                            className="max-w-[150px]"
                          />
                        ) : (
                          user.phone
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            user.role === "ADMIN"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {editingUserId === user.id ? (
                          <div className="flex items-center">
                            <input
                              name="enabled"
                              type="checkbox"
                              checked={editFormData.enabled}
                              onChange={handleInputChange}
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <Label htmlFor="enabled" className="ml-2 text-sm">
                              Enabled
                            </Label>
                          </div>
                        ) : (
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              user.enabled
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                            }`}
                          >
                            {user.enabled ? "Active" : "Inactive"}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {editingUserId === user.id ? (
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={handleSaveEdit}>
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => user.id && handleDelete(user.id)}
                              disabled={user.role === "ADMIN"}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No users found</div>
          )}

          {users.length > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {users.length} of {pagination.totalItems} users
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === 0}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.isLast}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Users
