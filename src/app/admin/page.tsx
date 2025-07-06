"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminManager from '@/components/AdminManager'
import { useAuth } from '@/contexts/AuthContext'

export default function AdminPage() {
  const router = useRouter()
  const { isAuthenticated, currentAdmin } = useAuth()

  // Verificar se está em produção
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      router.push('/')
      return
    }
  }, [router])

  // Se estiver em produção, não renderiza nada
  if (process.env.NODE_ENV === 'production') {
    return null
  }

  // Verificar autenticação
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#2c3e50] mb-4">Acesso Negado</h1>
          <p className="text-[#7f8c8d]">Você precisa estar logado para acessar esta página.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#2c3e50] mb-2">
            Painel de Administração
          </h1>
          <p className="text-[#7f8c8d]">
            Bem-vindo, {currentAdmin?.name} ({currentAdmin?.email})
          </p>
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-2xl mx-auto">
            <p className="text-yellow-800 text-sm">
              ⚠️ <strong>Atenção:</strong> Esta página só está disponível em desenvolvimento.
              Em produção, use o painel administrativo do Supabase para gerenciar administradores.
            </p>
          </div>
        </div>

        {/* Admin Manager */}
        <AdminManager />
      </div>
    </div>
  )
} 