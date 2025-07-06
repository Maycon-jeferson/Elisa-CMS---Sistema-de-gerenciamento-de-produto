"use client"

import { useState, useEffect } from 'react'
import { AuthService, Admin } from '@/lib/auth'
import { User, Plus, Trash2, Eye, EyeOff } from 'lucide-react'

export default function AdminManager() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newAdmin, setNewAdmin] = useState({
    email: '',
    password: '',
    name: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    loadAdmins()
  }, [])

  // Verificar se está em desenvolvimento
  if (process.env.NODE_ENV === 'production') {
    return null
  }

  const loadAdmins = async () => {
    setLoading(true)
    try {
      const data = await AuthService.listAdmins()
      setAdmins(data)
    } catch (error) {
      console.error('Erro ao carregar admins:', error)
      setMessage({ type: 'error', text: 'Erro ao carregar administradores' })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newAdmin.email || !newAdmin.password || !newAdmin.name) {
      setMessage({ type: 'error', text: 'Preencha todos os campos' })
      return
    }

    try {
      const admin = await AuthService.createAdmin(
        newAdmin.email,
        newAdmin.password,
        newAdmin.name
      )

      if (admin) {
        setMessage({ type: 'success', text: 'Administrador criado com sucesso!' })
        setNewAdmin({ email: '', password: '', name: '' })
        setShowCreateForm(false)
        loadAdmins()
      } else {
        setMessage({ type: 'error', text: 'Erro ao criar administrador' })
      }
    } catch (error) {
      console.error('Erro ao criar admin:', error)
      setMessage({ type: 'error', text: 'Erro ao criar administrador' })
    }
  }

  const clearMessage = () => {
    setMessage(null)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#2c3e50] flex items-center">
          <User className="h-6 w-6 mr-2" />
          Gerenciar Administradores (DEV)
        </h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-gradient-to-r from-[#8b4513] to-[#d2691e] text-white px-4 py-2 rounded-lg hover:from-[#a0522d] hover:to-[#8b4513] transition-all duration-300 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Admin
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded-lg mb-4 ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <div className="flex justify-between items-center">
            <span>{message.text}</span>
            <button onClick={clearMessage} className="text-sm underline">Fechar</button>
          </div>
        </div>
      )}

      {/* Formulário de criação */}
      {showCreateForm && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-[#2c3e50] mb-4">Criar Novo Administrador</h3>
          <form onSubmit={handleCreateAdmin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#2c3e50] mb-1">Nome</label>
              <input
                type="text"
                value={newAdmin.name}
                onChange={(e) => setNewAdmin(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-[#e8e8e8] rounded-md focus:ring-[#8b4513] focus:border-[#8b4513]"
                placeholder="Nome completo"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2c3e50] mb-1">E-mail</label>
              <input
                type="email"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-[#e8e8e8] rounded-md focus:ring-[#8b4513] focus:border-[#8b4513]"
                placeholder="admin@exemplo.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2c3e50] mb-1">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 border border-[#e8e8e8] rounded-md focus:ring-[#8b4513] focus:border-[#8b4513] pr-10"
                  placeholder="Senha segura"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-gradient-to-r from-[#8b4513] to-[#d2691e] text-white px-4 py-2 rounded-lg hover:from-[#a0522d] hover:to-[#8b4513] transition-all duration-300"
              >
                Criar Admin
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 border border-[#e8e8e8] text-[#2c3e50] rounded-lg hover:bg-gray-50 transition-all duration-300"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de admins */}
      <div className="bg-white border border-[#e8e8e8] rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-[#e8e8e8]">
          <h3 className="text-lg font-semibold text-[#2c3e50]">Administradores ({admins.length})</h3>
        </div>
        
        {loading ? (
          <div className="p-6 text-center text-[#7f8c8d]">
            Carregando administradores...
          </div>
        ) : admins.length === 0 ? (
          <div className="p-6 text-center text-[#7f8c8d]">
            Nenhum administrador encontrado
          </div>
        ) : (
          <div className="divide-y divide-[#e8e8e8]">
            {admins.map((admin) => (
              <div key={admin.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-[#2c3e50]">{admin.name}</h4>
                  <p className="text-sm text-[#7f8c8d]">{admin.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      admin.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {admin.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {admin.role}
                    </span>
                  </div>
                  {admin.last_login && (
                    <p className="text-xs text-[#7f8c8d] mt-1">
                      Último login: {new Date(admin.last_login).toLocaleString('pt-BR')}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remover admin"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-[#7f8c8d] text-center">
        <p>⚠️ Este componente só está disponível em desenvolvimento por questões de segurança.</p>
        <p>Em produção, use o painel administrativo do Supabase para gerenciar administradores.</p>
      </div>
    </div>
  )
} 