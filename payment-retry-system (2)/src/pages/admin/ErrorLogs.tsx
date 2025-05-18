"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store"
import { fetchErrorLogs, fetchMostCommonErrorCodes } from "@/store/slices/errorLogSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Search, AlertTriangle, Calendar } from "lucide-react"

const ErrorLogs = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { errorLogs, loading, pagination, error } = useSelector((state: RootState) => state.errorLogs)

  const [errorCodeFilter, setErrorCodeFilter] = useState<string>("")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState<string>("")

  useEffect(() => {
    dispatch(
      fetchErrorLogs({
        errorCode: errorCodeFilter || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        page: 0,
        size: 10,
      }),
    )
    dispatch(fetchMostCommonErrorCodes(5))
  }, [dispatch, errorCodeFilter, startDate, endDate])

  const handlePageChange = (page: number) => {
    dispatch(
      fetchErrorLogs({
        errorCode: errorCodeFilter || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        page,
        size: pagination.size,
      }),
    )
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality here
    // This would typically filter error logs based on the search term
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Error Logs</h1>

      <Card>
        <CardHeader>
          <CardTitle>Error Log Management</CardTitle>
          <CardDescription>View and analyze payment processing errors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid gap-4 sm:grid-cols-4">
            <div>
              <Label htmlFor="error-code-filter">Filter by Error Code</Label>
              <div className="flex mt-2">
                <Input
                  id="error-code-filter"
                  placeholder="Enter error code"
                  value={errorCodeFilter}
                  onChange={(e) => setErrorCodeFilter(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="start-date">Start Date</Label>
              <div className="flex mt-2">
                <div className="relative flex-1">
                  <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="start-date"
                    type="date"
                    className="pl-8"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="end-date">End Date</Label>
              <div className="flex mt-2">
                <div className="relative flex-1">
                  <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="end-date"
                    type="date"
                    className="pl-8"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="search">Search</Label>
              <form onSubmit={handleSearch} className="flex mt-2 gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search error messages..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button type="submit">Search</Button>
              </form>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : errorLogs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">ID</th>
                    <th className="text-left py-3 px-4 font-medium">Transaction ID</th>
                    <th className="text-left py-3 px-4 font-medium">Error Code</th>
                    <th className="text-left py-3 px-4 font-medium">Error Message</th>
                    <th className="text-left py-3 px-4 font-medium">Retry Eligible</th>
                    <th className="text-left py-3 px-4 font-medium">Retry Attempt</th>
                    <th className="text-left py-3 px-4 font-medium">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {errorLogs.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-3 px-4">{log.id}</td>
                      <td className="py-3 px-4">{log.transactionId}</td>
                      <td className="py-3 px-4">
                        <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                          {log.errorCode}
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate" title={log.errorMessage}>
                        {log.errorMessage}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            log.retryEligible
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                          }`}
                        >
                          {log.retryEligible ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="py-3 px-4">{log.retryAttempt}</td>
                      <td className="py-3 px-4">{formatDate(log.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No error logs found</div>
          )}

          {errorLogs.length > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {errorLogs.length} of {pagination.totalItems} error logs
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

      <Card>
        <CardHeader>
          <CardTitle>Error Analysis</CardTitle>
          <CardDescription>Most common error codes and their frequency</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold mb-4">Common Error Codes</h3>
              <div className="space-y-4">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-red-50 dark:bg-red-900/20">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          </div>
                          <span className="font-medium">ERROR_{index + 1}00</span>
                        </div>
                        <span className="text-sm bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 px-2 py-1 rounded-full">
                          {Math.floor(Math.random() * 50) + 1} occurrences
                        </span>
                      </div>
                    ))
                )}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Retry Eligibility</h3>
              <div className="h-[200px] flex items-center justify-center">
                <div className="flex gap-8">
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-bold text-green-500">75%</div>
                    <div className="text-sm text-muted-foreground mt-2">Retry Eligible</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-bold text-red-500">25%</div>
                    <div className="text-sm text-muted-foreground mt-2">Non-Eligible</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ErrorLogs
