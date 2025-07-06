"use client"

import { useState } from "react"
import AdminLoginForm from "./AdminLoginForm"
import { useAuth } from "@/contexts/AuthContext"

export default function AdminLoginModal() {
  const { isAuthenticated, logout } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <>
      {isAuthenticated ? (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-green-600 font-medium">Admin Logado</span>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors"
        >
          Login Administrador
        </button>
      )}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-md mx-auto">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label="Fechar"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="bg-white rounded-lg shadow-xl p-0">
              <AdminLoginForm onSuccess={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  )
} 