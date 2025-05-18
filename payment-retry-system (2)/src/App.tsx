"use client"

import { useEffect } from "react"
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"

// Layouts
import AuthLayout from "./layouts/AuthLayout"
import DashboardLayout from "./layouts/DashboardLayout"

// Auth Pages
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"

// User Pages
import UserDashboard from "./pages/user/Dashboard"
import UserTransactions from "./pages/user/Transactions"
import UserTransactionDetail from "./pages/user/TransactionDetail"
import UserPaymentMethods from "./pages/user/PaymentMethods"
import UserProfile from "./pages/user/Profile"
import NewTransaction from "./pages/user/NewTransaction"

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard"
import AdminUsers from "./pages/admin/Users"
import AdminTransactions from "./pages/admin/Transactions"
import AdminTransactionDetail from "./pages/admin/TransactionDetail"
import AdminErrorLogs from "./pages/admin/ErrorLogs"
import AdminRetryConfig from "./pages/admin/RetryConfig"

// Redux
import type { RootState } from "./store"
import { refreshUser } from "./store/slices/authSlice"

function App() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()

  useEffect(() => {
    // Check for token in localStorage and refresh user data
    dispatch(refreshUser())
  }, [dispatch])

  // Protected route component
  const ProtectedRoute = ({ children, requiredRole }: { children: JSX.Element; requiredRole?: string }) => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      return <Navigate to="/login" state={{ from: location }} replace />
    }

    // Check if user has required role
    if (requiredRole && user?.role !== requiredRole) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page",
        variant: "destructive",
      })

      // Redirect to appropriate dashboard based on role
      return <Navigate to={user?.role === "ADMIN" ? "/admin" : "/"} replace />
    }

    return children
  }

  return (
    <>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* User Dashboard Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<UserDashboard />} />
          <Route path="transactions" element={<UserTransactions />} />
          <Route path="transactions/:id" element={<UserTransactionDetail />} />
          <Route path="payment-methods" element={<UserPaymentMethods />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="transactions/new" element={<NewTransaction />} />
        </Route>

        {/* Admin Dashboard Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="transactions" element={<AdminTransactions />} />
          <Route path="transactions/:id" element={<AdminTransactionDetail />} />
          <Route path="error-logs" element={<AdminErrorLogs />} />
          <Route path="retry-config" element={<AdminRetryConfig />} />
        </Route>

        {/* Redirect to login for any other routes */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? (user?.role === "ADMIN" ? "/admin" : "/") : "/login"} replace />}
        />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
