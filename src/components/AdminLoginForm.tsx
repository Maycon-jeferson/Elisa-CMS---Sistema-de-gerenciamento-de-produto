"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"

interface AdminLoginFormProps {
  onLogin?: (email: string, password: string) => Promise<void> | void
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
          alert("Login de administrador bem-sucedido!")
          onSuccess?.()
        } else {
          setError("E-mail ou senha incorretos.")
        }
      }
    } catch (error) {
      setError("Erro ao fazer login.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto bg-white p-8 rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-900">Login do Administrador</h2>
      
      {/* Credenciais de teste */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Credenciais de Administrador:</h3>
        <div className="text-xs text-blue-700 space-y-1">
          <p><strong>Email:</strong> admin@elizacms.com</p>
          <p><strong>Senha:</strong> ElizaCMS2024!@#</p>
        </div>
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 text-sm text-center">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  )
} 