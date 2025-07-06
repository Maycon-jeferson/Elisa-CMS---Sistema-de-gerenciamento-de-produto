'use client'

import { AuthProvider } from '@/contexts/AuthContext'
import { ReactNode } from 'react'

interface ClientAuthProviderProps {
  children: ReactNode
}

export default function ClientAuthProvider({ children }: ClientAuthProviderProps) {
  return <AuthProvider>{children}</AuthProvider>
} 