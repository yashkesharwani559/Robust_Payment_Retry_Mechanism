"use client"

import type React from "react"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import type { AppDispatch, RootState } from "@/store"
import { fetchTransactionById, retryTransaction } from "@/store/slices/transactionSlice"
import { updateTransactionRetryConfig } from "@/store/slices/retryConfigSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, RefreshCw, Loader2, Settings } from "lucide-react"
import { useState } from "react"
import type { RetryConfigRequest } from "@/types"

const AdminTransactionDetail = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { currentTransaction, loading, error } = useSelector((state: RootState) => state.transactions)
  const { loading: configLoading } = useSelector((state: RootState) => state.retryConfig)

  const [showRetryConfig, setShowRetryConfig] = useState(false)
  const [retryConfig, setRetryConfig] = useState<RetryConfigRequest>({
    maxRetries: 3,
    retryInterval: 60,
    strategy: RetryStrategy.EXPONENTIAL,
  })

  useEffect(() => {
    if (id) {
      dispatch(fetchTransactionById(Number.parseInt(id)))
    }
  }, [dispatch, id])

  useEffect(() => {
    if (currentTransaction?.retryConfig) {
      setRetryConfig({
        maxRetries: currentTransaction.retryConfig.maxRetries,
        retryInterval: currentTransaction.retryConfig.retryInterval,
        strategy: currentTransaction.retryConfig.strategy,
      })
    }
  }, [currentTransaction])

  const handleRetry = async () => {
    if (!id) return

    try {
      await dispatch(retryTransaction(Number.parseInt(id))).unwrap()
      toast({
        title: "Retry Initiated",
        description: "The transaction retry has been scheduled.",
      })
      // Refresh transaction data
      dispatch(fetchTransactionById(Number.parseInt(id)))
    } catch (err) {
      toast({
        title: "Retry Failed",
        description: error || "Failed to retry transaction. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setRetryConfig({
      ...retryConfig,
      [name]: name === "maxRetries" || name === "retryInterval" ? Number.parseInt(value) : value,
    })
  }

  const handleSaveConfig = async () => {
    if (!id) return

    try {
      await dispatch(
        updateTransactionRetryConfig({
          txId: Number.parseInt(id),
          config: retryConfig,
        }),
      ).unwrap()
      toast({
        title: "Configuration Updated",
        description: "The retry configuration has been updated successfully.",
      })
      setShowRetryConfig(false)
      // Refresh transaction data
      dispatch(fetchTransactionById(Number.parseInt(id)))
    } catch (err) {
      toast({
        title: "Update Failed",
        description: error || "Failed to update retry configuration. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "FAILED":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "RETRY_SCHEDULED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "RETRY_IN_PROGRESS":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  const canRetry = currentTransaction?.status === "FAILED"

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/admin/transactions")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Transaction Details</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : currentTransaction ? (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Transaction Information</CardTitle>
                <CardDescription>Details about this payment transaction</CardDescription>
              </div>
              <div className="flex gap-2">
                {canRetry && (
                  <Button variant="outline" onClick={handleRetry} disabled={loading}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retry
                  </Button>
                )}
                <Button variant="outline" onClick={() => setShowRetryConfig(!showRetryConfig)}>
                  <Settings className="mr-2 h-4 w-4" />
                  Configure Retry
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-6">
                  <dt className="text-sm font-medium text-muted-foreground">Transaction ID</dt>
                  <dd className="text-sm font-semibold">{currentTransaction.id}</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-6">
                  <dt className="text-sm font-medium text-muted-foreground">User</dt>
                  <dd className="text-sm font-semibold">{currentTransaction.user?.name || "Unknown"}</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-6">
                  <dt className="text-sm font-medium text-muted-foreground">Amount</dt>
                  <dd className="text-sm font-semibold">
                    {currentTransaction.currency} {currentTransaction.amount.toFixed(2)}
                  </dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-6">
                  <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                  <dd className="text-sm">
                    <span className={`px-2 py-1 rounded-full ${getStatusBadgeClass(currentTransaction.status)}`}>
                      {currentTransaction.status.replace("_", " ")}
                    </span>
                  </dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-6">
                  <dt className="text-sm font-medium text-muted-foreground">Created At</dt>
                  <dd className="text-sm">{new Date(currentTransaction.createdAt).toLocaleString()}</dd>
                </div>
                {currentTransaction.completedAt && (
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-6">
                    <dt className="text-sm font-medium text-muted-foreground">Completed At</dt>
                    <dd className="text-sm">{new Date(currentTransaction.completedAt).toLocaleString()}</dd>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-6">
                  <dt className="text-sm font-medium text-muted-foreground">Payment Gateway</dt>
                  <dd className="text-sm font-semibold">{currentTransaction.gateway}</dd>
                </div>
                {currentTransaction.externalReferenceId && (
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-6">
                    <dt className="text-sm font-medium text-muted-foreground">Reference ID</dt>
                    <dd className="text-sm">{currentTransaction.externalReferenceId}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Payment method used for this transaction</CardDescription>
            </CardHeader>
            <CardContent>
              {currentTransaction.paymentMethod ? (
                <dl className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-6">
                    <dt className="text-sm font-medium text-muted-foreground">Method Name</dt>
                    <dd className="text-sm font-semibold">{currentTransaction.paymentMethod.methodName}</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-6">
                    <dt className="text-sm font-medium text-muted-foreground">Details</dt>
                    <dd className="text-sm">{currentTransaction.paymentMethod.details}</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-6">
                    <dt className="text-sm font-medium text-muted-foreground">Priority</dt>
                    <dd className="text-sm">{currentTransaction.paymentMethod.priority}</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-6">
                    <dt className="text-sm font-medium text-muted-foreground">Default</dt>
                    <dd className="text-sm">{currentTransaction.paymentMethod.isDefault ? "Yes" : "No"}</dd>
                  </div>
                </dl>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No payment method information available</div>
              )}
            </CardContent>
          </Card>

          {showRetryConfig && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Retry Configuration</CardTitle>
                <CardDescription>Configure retry settings for this transaction</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="maxRetries">Maximum Retries</Label>
                    <Input
                      id="maxRetries"
                      name="maxRetries"
                      type="number"
                      min="1"
                      max="10"
                      value={retryConfig.maxRetries}
                      onChange={handleConfigChange}
                    />
                    <p className="text-xs text-muted-foreground">Maximum number of retry attempts</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retryInterval">Retry Interval (seconds)</Label>
                    <Input
                      id="retryInterval"
                      name="retryInterval"
                      type="number"
                      min="30"
                      value={retryConfig.retryInterval}
                      onChange={handleConfigChange}
                    />
                    <p className="text-xs text-muted-foreground">Time between retry attempts</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="strategy">Retry Strategy</Label>
                    <select
                      id="strategy"
                      name="strategy"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={retryConfig.strategy}
                      onChange={handleConfigChange}
                    >
                      <option value={RetryStrategy.FIXED}>Fixed Interval</option>
                      <option value={RetryStrategy.EXPONENTIAL}>Exponential Backoff</option>
                    </select>
                    <p className="text-xs text-muted-foreground">How retry intervals are calculated</p>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowRetryConfig(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveConfig} disabled={configLoading}>
                    {configLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Configuration"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentTransaction.retryConfig && !showRetryConfig && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Retry Configuration</CardTitle>
                <CardDescription>Retry settings for this transaction</CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="grid gap-4 sm:grid-cols-3">
                  <div className="flex flex-col">
                    <dt className="text-sm font-medium text-muted-foreground">Max Retries</dt>
                    <dd className="text-2xl font-semibold mt-2">{currentTransaction.retryConfig.maxRetries}</dd>
                  </div>
                  <div className="flex flex-col">
                    <dt className="text-sm font-medium text-muted-foreground">Current Attempts</dt>
                    <dd className="text-2xl font-semibold mt-2">
                      {currentTransaction.retryConfig.currentAttempts || 0}
                    </dd>
                  </div>
                  <div className="flex flex-col">
                    <dt className="text-sm font-medium text-muted-foreground">Retry Strategy</dt>
                    <dd className="text-2xl font-semibold mt-2">{currentTransaction.retryConfig.strategy}</dd>
                  </div>
                  <div className="flex flex-col">
                    <dt className="text-sm font-medium text-muted-foreground">Retry Interval</dt>
                    <dd className="text-lg font-semibold mt-2">
                      {currentTransaction.retryConfig.retryInterval} seconds
                    </dd>
                  </div>
                  {currentTransaction.retryConfig.nextRetryTime && (
                    <div className="flex flex-col">
                      <dt className="text-sm font-medium text-muted-foreground">Next Retry At</dt>
                      <dd className="text-lg font-semibold mt-2">
                        {new Date(currentTransaction.retryConfig.nextRetryTime).toLocaleString()}
                      </dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-xl font-semibold mb-2">Transaction Not Found</h3>
            <p className="text-muted-foreground mb-6">
              The transaction you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button onClick={() => navigate("/admin/transactions")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Transactions
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default AdminTransactionDetail
