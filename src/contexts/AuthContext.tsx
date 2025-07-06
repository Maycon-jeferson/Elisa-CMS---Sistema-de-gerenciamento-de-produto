'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { AuthService, Admin } from '@/lib/auth'

interface AuthContextType {
  isAuthenticated: boolean
  currentAdmin: Admin | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null)
  
  // Verificar token ao inicializar (apenas no cliente)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token')
      if (token) {
        const admin = AuthService.verifyToken(token)
        if (admin) {
          setIsAuthenticated(true)
          setCurrentAdmin(admin)
        } else {
          localStorage.removeItem('admin_token')
        }
      }
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const admin = await AuthService.verifyCredentials(email, password)
      
      if (admin) {
        const token = AuthService.generateToken(admin)
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('admin_token', token)
        }
        
        setIsAuthenticated(true)
        setCurrentAdmin(admin)
        return true
      }
      
      return false
    } catch (error) {
      console.error('Erro no login:', error)
      return false
    }
  }

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token')
    }
    setIsAuthenticated(false)
    setCurrentAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
} 