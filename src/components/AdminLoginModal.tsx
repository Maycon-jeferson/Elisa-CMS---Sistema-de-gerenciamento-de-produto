"use client"

import { useState } from "react"
import AdminLoginForm from "./AdminLoginForm"
import { useAuth } from "@/contexts/AuthContext"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

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
          className="px-4 py-2 bg-gradient-to-r from-[#8b4513] to-[#d2691e] text-white rounded-full shadow-natura font-semibold hover:from-[#a0522d] hover:to-[#8b4513] transition-all duration-300"
        >
          Login Administrador
        </button>
      )}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-md mx-auto"
              initial={{ scale: 0.95, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 40 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute -top-4 -right-4 bg-white rounded-full shadow p-2 text-[#8b4513] hover:bg-[#f4f1eb] hover:text-[#d2691e] transition-colors focus:outline-none border border-[#e8e8e8]"
                aria-label="Fechar"
              >
                <X className="h-6 w-6" />
              </button>
              <div className="bg-white rounded-2xl shadow-2xl border border-[#e8e8e8] p-0 overflow-hidden animate-fadeIn">
                <AdminLoginForm onSuccess={() => setOpen(false)} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 