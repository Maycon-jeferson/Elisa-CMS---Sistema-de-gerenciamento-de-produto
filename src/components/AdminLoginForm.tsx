"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"

interface AdminLoginFormProps {
  onLogin?: (email: string, password: string) => Promise<void>
  onSuccess?: () => void
}

export default function AdminLoginForm({ onLogin, onSuccess }: AdminLoginFormProps) {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password.trim()) {
      setError("Preencha todos os campos.")
      return
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("E-mail inválido.")
      return
    }
    
    setLoading(true)
    try {
      if (onLogin) {
        await onLogin(email, password)
      } else {
        const success = await login(email, password)
        
        if (success) {
          onSuccess?.()
        } else {
          setError("E-mail ou senha incorretos.")
        }
      }
    } catch (error) {
      console.error('Erro no login:', error)
      setError("Erro ao fazer login. Verifique sua conexão.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto bg-white p-8 rounded-2xl shadow-xl space-y-6">
      <h2 className="text-2xl font-bold text-center text-[#2c3e50]">Login do Administrador</h2>
      {error && (
        <div className="bg-red-50 border border-red-200 text-[#e74c3c] rounded-lg p-4 text-sm text-center shadow-sm">
          <div className="flex items-center justify-center">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
            {error}
          </div>
        </div>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#2c3e50] mb-1">E-mail</label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          className="w-full px-4 py-3 border border-[#e8e8e8] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8b4513] focus:border-[#8b4513] text-[#2c3e50] placeholder:text-[#7f8c8d] transition-all duration-200"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="admin@elizacms.com"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-[#2c3e50] mb-1">Senha</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          className="w-full px-4 py-3 border border-[#e8e8e8] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8b4513] focus:border-[#8b4513] text-[#2c3e50] placeholder:text-[#7f8c8d] transition-all duration-200"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-6 bg-gradient-to-r from-[#8b4513] to-[#d2691e] text-white font-semibold rounded-full shadow-natura hover:from-[#a0522d] hover:to-[#8b4513] hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#8b4513] focus:ring-offset-2"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Entrando...
          </div>
        ) : (
          "Entrar"
        )}
      </button>
    </form>
  )
} 