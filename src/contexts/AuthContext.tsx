'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { AuthService } from '@/lib/auth'

interface AuthContextType {
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  
  // Verificar token ao inicializar (apenas no cliente)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token')
      if (token) {
        const payload = AuthService.verifyToken(token)
        if (payload) {
          setIsAuthenticated(true)
        } else {
          localStorage.removeItem('admin_token')
        }
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const isValid = await AuthService.verifyCredentials(email, password)
      
      if (isValid) {
        const token = AuthService.generateToken(email)
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('admin_token', token)
        }
        
        setIsAuthenticated(true)
        return true
      }
      
      return false
    } catch (error) {
      return false
    }
  }

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token')
    }
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 