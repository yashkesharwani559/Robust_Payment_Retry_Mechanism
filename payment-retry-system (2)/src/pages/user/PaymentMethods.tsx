"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store"
import {
  fetchPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} from "@/store/slices/paymentMethodSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Plus, Edit, Trash2, CreditCard, Check } from "lucide-react"
import type { PaymentMethodRequest } from "@/types"

const PaymentMethods = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { paymentMethods, loading, error } = useSelector((state: RootState) => state.paymentMethods)
  const { toast } = useToast()

  const [isAddingMethod, setIsAddingMethod] = useState(false)
  const [editingMethodId, setEditingMethodId] = useState<number | null>(null)
  const [formData, setFormData] = useState<PaymentMethodRequest>({
    methodName: "",
    details: "",
    priority: 1,
    default: false,
  })

  useEffect(() => {
    dispatch(fetchPaymentMethods())
  }, [dispatch])

  const resetForm = () => {
    setFormData({
      methodName: "",
      details: "",
      priority: 1,
      default: false,
    })
    setIsAddingMethod(false)
    setEditingMethodId(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingMethodId) {
        await dispatch(updatePaymentMethod({ id: editingMethodId, paymentMethod: formData })).unwrap()
        toast({
          title: "Payment Method Updated",
          description: "Your payment method has been updated successfully.",
        })
      } else {
        await dispatch(createPaymentMethod(formData)).unwrap()
        toast({
          title: "Payment Method Added",
          description: "Your new payment method has been added successfully.",
        })
      }
      resetForm()
    } catch (err) {
      toast({
        title: "Action Failed",
        description: error || "Failed to save payment method. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (id: number) => {
    const methodToEdit = paymentMethods.find((method) => method.id === id)
    if (methodToEdit) {
      setFormData({
        methodName: methodToEdit.methodName,
        details: methodToEdit.details,
        priority: methodToEdit.priority,
        default: methodToEdit.isDefault,
      })
      setEditingMethodId(id)
      setIsAddingMethod(true)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this payment method?")) {
      try {
        await dispatch(deletePaymentMethod(id)).unwrap()
        toast({
          title: "Payment Method Deleted",
          description: "The payment method has been deleted successfully.",
        })
      } catch (err) {
        toast({
          title: "Delete Failed",
          description: error || "Failed to delete payment method. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Payment Methods</h1>
        <div className="mt-4 sm:mt-0">
          {!isAddingMethod && (
            <Button onClick={() => setIsAddingMethod(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Payment Method
            </Button>
          )}
        </div>
      </div>

      {isAddingMethod && (
        <Card>
          <CardHeader>
            <CardTitle>{editingMethodId ? "Edit Payment Method" : "Add New Payment Method"}</CardTitle>
            <CardDescription>
              {editingMethodId ? "Update your payment method details" : "Enter the details of your new payment method"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="methodName">Method Name</Label>
                  <Input
                    id="methodName"
                    name="methodName"
                    placeholder="Credit Card, PayPal, etc."
                    value={formData.methodName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Input
                    id="priority"
                    name="priority"
                    type="number"
                    min="1"
                    value={formData.priority}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="details">Details</Label>
                <Input
                  id="details"
                  name="details"
                  placeholder="Card ending in 1234, account email, etc."
                  value={formData.details}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  id="default"
                  name="default"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={formData.default}
                  onChange={handleInputChange}
                />
                <Label htmlFor="default" className="text-sm font-medium">
                  Set as default payment method
                </Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      {editingMethodId ? "Update" : "Save"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Your Payment Methods</CardTitle>
          <CardDescription>Manage your saved payment methods</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && !isAddingMethod ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : paymentMethods.length > 0 ? (
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20">
                      <CreditCard className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="font-medium flex items-center">
                        {method.methodName}
                        {method.isDefault && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">{method.details}</div>
                      <div className="text-xs text-muted-foreground">Priority: {method.priority}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 sm:mt-0">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(method.id)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(method.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p className="mb-4">You don't have any payment methods yet.</p>
              {!isAddingMethod && (
                <Button onClick={() => setIsAddingMethod(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Payment Method
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default PaymentMethods
