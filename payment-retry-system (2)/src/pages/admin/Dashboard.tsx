"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store"
import {
  fetchTransactionTrend,
  fetchRetrySuccessRate,
  fetchCommonErrorCodes,
  fetchAverageRetryAttempts,
} from "@/store/slices/analyticsSlice"
import { fetchAllTransactions } from "@/store/slices/transactionSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Loader2, ArrowRight, BarChart3, PieChart, TrendingUp, AlertTriangle } from "lucide-react"

const AdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { transactionTrend, retrySuccessRate, commonErrorCodes, averageRetryAttempts, loading } = useSelector(
    (state: RootState) => state.analytics,
  )
  const { transactions } = useSelector((state: RootState) => state.transactions)

  useEffect(() => {
    dispatch(fetchTransactionTrend(7))
    dispatch(fetchRetrySuccessRate())
    dispatch(fetchCommonErrorCodes(5))
    dispatch(fetchAverageRetryAttempts())
    dispatch(fetchAllTransactions({ page: 0, size: 5 }))
  }, [dispatch])

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <div className="mt-4 sm:mt-0">
          <Button onClick={() => navigate("/admin/retry-config")}>Manage Retry Configuration</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Retry Success Rate</p>
                <h3 className="text-2xl font-bold mt-1">
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : `${(retrySuccessRate || 0).toFixed(2)}%`}
                </h3>
              </div>
              <div className="p-2 rounded-full bg-green-50 dark:bg-green-900/20">
                <PieChart className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Retry Attempts</p>
                <h3 className="text-2xl font-bold mt-1">
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : `${(averageRetryAttempts || 0).toFixed(1)}`}
                </h3>
              </div>
              <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20">
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                <h3 className="text-2xl font-bold mt-1">
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    transactionTrend.reduce((sum, day) => sum + day.total, 0)
                  )}
                </h3>
              </div>
              <div className="p-2 rounded-full bg-purple-50 dark:bg-purple-900/20">
                <BarChart3 className="h-5 w-5 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Common Errors</p>
                <h3 className="text-2xl font-bold mt-1">
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : commonErrorCodes.length}
                </h3>
              </div>
              <div className="p-2 rounded-full bg-red-50 dark:bg-red-900/20">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Transaction Trend</CardTitle>
            <CardDescription>Last 7 days transaction activity</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : transactionTrend.length > 0 ? (
              <div className="h-[300px] w-full">
                {/* Simple bar chart visualization */}
                <div className="flex h-full items-end gap-2">
                  {transactionTrend.map((day, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div className="w-full flex gap-0.5 justify-center">
                        <div
                          className="bg-green-500 rounded-t w-3"
                          style={{
                            height: `${(day.successful / Math.max(...transactionTrend.map((d) => d.total || 1))) * 200}px`,
                          }}
                        />
                        <div
                          className="bg-red-500 rounded-t w-3"
                          style={{
                            height: `${(day.failed / Math.max(...transactionTrend.map((d) => d.total || 1))) * 200}px`,
                          }}
                        />
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        {new Date(day.date).toLocaleDateString(undefined, { weekday: "short" })}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-green-500 rounded" />
                    <span className="text-sm">Success</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-red-500 rounded" />
                    <span className="text-sm">Failed</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No transaction data available</div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Common Error Codes</CardTitle>
            <CardDescription>Most frequent payment errors</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : commonErrorCodes.length > 0 ? (
              <div className="space-y-4">
                {commonErrorCodes.map((error, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-red-50 dark:bg-red-900/20">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      </div>
                      <span className="font-medium">{error.errorCode}</span>
                    </div>
                    <span className="text-sm bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 px-2 py-1 rounded-full">
                      {error.count} occurrences
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No error data available</div>
            )}
            <div className="mt-4 text-center">
              <Button variant="outline" onClick={() => navigate("/admin/error-logs")}>
                View All Error Logs
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest payment transactions across all users</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">ID</th>
                    <th className="text-left py-3 px-4 font-medium">User</th>
                    <th className="text-left py-3 px-4 font-medium">Amount</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-3 px-4">{tx.id}</td>
                      <td className="py-3 px-4">{tx.user?.name || "Unknown"}</td>
                      <td className="py-3 px-4">
                        {tx.currency} {tx.amount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(tx.status)}`}>
                          {tx.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3 px-4">{new Date(tx.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/transactions/${tx.id}`)}>
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No transactions found</div>
          )}
          <div className="mt-4 text-center">
            <Button variant="outline" onClick={() => navigate("/admin/transactions")}>
              View All Transactions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminDashboard
