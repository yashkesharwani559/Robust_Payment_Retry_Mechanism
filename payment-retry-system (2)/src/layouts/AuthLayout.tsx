"use client"

import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import { ModeToggle } from "@/components/mode-toggle"

const AuthLayout = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (isAuthenticated) {
      navigate(user?.role === "ADMIN" ? "/admin" : "/")
    }
  }, [isAuthenticated, navigate, user])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <header className="w-full p-4 flex justify-end">
        <ModeToggle />
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()} Payment Retry System. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default AuthLayout
