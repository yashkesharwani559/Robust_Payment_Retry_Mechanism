"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import type { AppDispatch, RootState } from "@/store"
import { createTransaction } from "@/store/slices/transactionSlice"
import { fetchPaymentMethods } from "@/store/slices/paymentMethodSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, CreditCard, Loader2, CheckCircle } from "lucide-react"

const NewTransaction = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { loading, error } = useSelector((state: RootState) => state.transactions)
  const { paymentMethods } = useSelector((state: RootState) => state.paymentMethods)

  const [formData, setFormData] = useState({
    amount: "",
    currency: "USD",
    paymentMethodId: "",
    allowRetry: true,
  })

  useEffect(() => {
    dispatch(fetchPaymentMethods())
  }, [dispatch])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.paymentMethodId) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method to continue.",
        variant: "destructive",
      })
      return
    }

    try {
      const transactionData = {
        amount: Number.parseFloat(formData.amount),
        currency: formData.currency,
        paymentMethodId: Number.parseInt(formData.paymentMethodId),
        allowRetry: formData.allowRetry,
      }

      const result = await dispatch(createTransaction(transactionData)).unwrap()

      toast({
        title: "Transaction Created",
        description: "Your transaction has been created successfully.",
      })

      // Navigate to the transaction detail page
      navigate(`/transactions/${result.id}`)
    } catch (err) {
      toast({
        title: "Transaction Failed",
        description: error || "Failed to create transaction. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/transactions")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Create New Transaction</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
          <CardDescription>Enter the details for your new payment transaction</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                    className="pl-8"
                  />
                  <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <select
                  id="currency"
                  name="currency"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.currency}
                  onChange={handleInputChange}
                  required
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethodId">Payment Method</Label>
              {paymentMethods.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="relative">
                      <input
                        type="radio"
                        id={`payment-method-${method.id}`}
                        name="paymentMethodId"
                        value={method.id}
                        checked={formData.paymentMethodId === method.id.toString()}
                        onChange={handleInputChange}
                        className="peer sr-only"
                      />
                      <label
                        htmlFor={`payment-method-${method.id}`}
                        className="flex flex-col gap-2 rounded-lg border border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-checked:border-primary peer-checked:bg-primary/10 cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-blue-500" />
                            <span className="font-medium">{method.methodName}</span>
                          </div>
                          {method.isDefault && (
                            <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">{method.details}</div>
                        <div className="absolute top-4 right-4 h-4 w-4 rounded-full border-2 border-muted peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground">
                          <CheckCircle className="h-3 w-3 text-white absolute top-0.5 left-0.5 opacity-0 peer-checked:opacity-100" />
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border rounded-md">
                  <p className="text-muted-foreground mb-4">You don't have any payment methods yet.</p>
                  <Button variant="outline" onClick={() => navigate("/payment-methods")}>
                    Add Payment Method
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="allowRetry"
                name="allowRetry"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={formData.allowRetry}
                onChange={handleInputChange}
              />
              <Label htmlFor="allowRetry" className="text-sm font-medium">
                Allow automatic retry for failed transactions
              </Label>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => navigate("/transactions")}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || paymentMethods.length === 0}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Create Transaction"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default NewTransaction
