"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store"
import { fetchGlobalRetryConfig, updateGlobalRetryConfig } from "@/store/slices/retryConfigSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Save, RefreshCw, Clock, Settings } from "lucide-react"
import type { RetryConfigRequest } from "@/types"
import { RetryStrategy } from "@/types"

const RetryConfig = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { globalConfig, loading, error } = useSelector((state: RootState) => state.retryConfig)
  const { toast } = useToast()

  const [formData, setFormData] = useState<RetryConfigRequest>({
    maxRetries: 3,
    retryInterval: 60,
    strategy: RetryStrategy.EXPONENTIAL,
  })

  useEffect(() => {
    dispatch(fetchGlobalRetryConfig())
  }, [dispatch])

  useEffect(() => {
    if (globalConfig) {
      setFormData({
        maxRetries: globalConfig.maxRetries,
        retryInterval: globalConfig.retryInterval,
        strategy: globalConfig.strategy,
      })
    }
  }, [globalConfig])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "maxRetries" || name === "retryInterval" ? Number.parseInt(value) : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await dispatch(updateGlobalRetryConfig(formData)).unwrap()
      toast({
        title: "Configuration Updated",
        description: "The global retry configuration has been updated successfully.",
      })
    } catch (err) {
      toast({
        title: "Update Failed",
        description: error || "Failed to update retry configuration. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Retry Configuration</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Global Retry Settings</CardTitle>
            <CardDescription>Configure the default retry behavior for all transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {loading && !globalConfig ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxRetries">Maximum Retries</Label>
                    <Input
                      id="maxRetries"
                      name="maxRetries"
                      type="number"
                      min="1"
                      max="10"
                      value={formData.maxRetries}
                      onChange={handleInputChange}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      The maximum number of retry attempts for failed transactions
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retryInterval">Retry Interval (seconds)</Label>
                    <Input
                      id="retryInterval"
                      name="retryInterval"
                      type="number"
                      min="30"
                      value={formData.retryInterval}
                      onChange={handleInputChange}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      The time interval between retry attempts (in seconds)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="strategy">Retry Strategy</Label>
                    <select
                      id="strategy"
                      name="strategy"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={formData.strategy}
                      onChange={handleInputChange}
                    >
                      <option value={RetryStrategy.FIXED}>Fixed Interval</option>
                      <option value={RetryStrategy.EXPONENTIAL}>Exponential Backoff</option>
                    </select>
                    <p className="text-xs text-muted-foreground">
                      Fixed: Retries at constant intervals. Exponential: Increases wait time between retries.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Configuration
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Retry Strategy Information</CardTitle>
            <CardDescription>Learn about different retry strategies and their use cases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-blue-500" />
                  Fixed Interval Strategy
                </h3>
                <p className="text-sm text-muted-foreground">
                  The fixed interval strategy attempts retries at regular, consistent intervals. For example, if the
                  retry interval is set to 60 seconds, each retry will occur exactly 60 seconds after the previous
                  attempt.
                </p>
                <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                  <p className="text-sm">
                    <span className="font-medium">Best for:</span> Predictable processing times, systems with consistent
                    load, or when you need regular retry attempts.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center">
                  <RefreshCw className="mr-2 h-5 w-5 text-purple-500" />
                  Exponential Backoff Strategy
                </h3>
                <p className="text-sm text-muted-foreground">
                  The exponential backoff strategy increases the wait time between retry attempts. For example, if the
                  initial retry interval is 60 seconds, subsequent retries might occur after 120 seconds, 240 seconds,
                  and so on.
                </p>
                <div className="mt-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md">
                  <p className="text-sm">
                    <span className="font-medium">Best for:</span> Handling temporary outages, avoiding overwhelming
                    external systems, or when failures might take longer to resolve.
                  </p>
                </div>
              </div>

              <div className="mt-4 p-4 border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-900/30 rounded-md">
                <h4 className="text-sm font-semibold flex items-center">
                  <Settings className="mr-2 h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  Configuration Tips
                </h4>
                <ul className="mt-2 text-sm space-y-1 text-muted-foreground">
                  <li>• Set max retries based on your transaction criticality and success rate</li>
                  <li>• Consider longer intervals for external payment gateway issues</li>
                  <li>• Use exponential backoff for intermittent network problems</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Retry Performance Metrics</CardTitle>
          <CardDescription>Statistics about retry effectiveness and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">Success Rate</span>
              <span className="text-3xl font-bold mt-2">68.5%</span>
              <span className="text-sm text-muted-foreground mt-1">Of retried transactions</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">Average Attempts</span>
              <span className="text-3xl font-bold mt-2">2.3</span>
              <span className="text-sm text-muted-foreground mt-1">Before success</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">Recovery Time</span>
              <span className="text-3xl font-bold mt-2">4.2 min</span>
              <span className="text-sm text-muted-foreground mt-1">Average time to success</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">Retry Volume</span>
              <span className="text-3xl font-bold mt-2">15.3%</span>
              <span className="text-sm text-muted-foreground mt-1">Of all transactions</span>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Success Rate by Error Type</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Error Code</th>
                    <th className="text-left py-3 px-4 font-medium">Description</th>
                    <th className="text-left py-3 px-4 font-medium">Retry Success Rate</th>
                    <th className="text-left py-3 px-4 font-medium">Avg. Attempts</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                        GATEWAY_TIMEOUT
                      </span>
                    </td>
                    <td className="py-3 px-4">Payment gateway connection timeout</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: "92%" }}></div>
                        </div>
                        <span>92%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">1.2</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                        INSUFFICIENT_FUNDS
                      </span>
                    </td>
                    <td className="py-3 px-4">Insufficient funds in account</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: "45%" }}></div>
                        </div>
                        <span>45%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">2.8</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                        NETWORK_ERROR
                      </span>
                    </td>
                    <td className="py-3 px-4">Network connection error</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: "78%" }}></div>
                        </div>
                        <span>78%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">1.5</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                        CARD_DECLINED
                      </span>
                    </td>
                    <td className="py-3 px-4">Card declined by issuer</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: "32%" }}></div>
                        </div>
                        <span>32%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">3.2</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RetryConfig
