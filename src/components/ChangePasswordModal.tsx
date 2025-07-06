"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Lock, Eye, EyeOff, Save, Loader2 } from "lucide-react"
import { AuthService } from "@/lib/auth"
import { useAuth } from "@/contexts/AuthContext"

interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const { currentAdmin } = useAuth()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    // Validações
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setError("Preencha todos os campos.")
      return
    }

    if (newPassword.length < 6) {
      setError("A nova senha deve ter pelo menos 6 caracteres.")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem.")
      return
    }

    if (newPassword === currentPassword) {
      setError("A nova senha deve ser diferente da senha atual.")
      return
    }

    if (!currentAdmin) {
      setError("Usuário não autenticado.")
      return
    }

    setLoading(true)
    try {
      const success = await AuthService.changePassword(
        currentAdmin.id,
        currentPassword,
        newPassword
      )

      if (success) {
        setSuccess(true)
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        
        // Fechar modal após 2 segundos
        setTimeout(() => {
          onClose()
          setSuccess(false)
        }, 2000)
      } else {
        setError("Senha atual incorreta.")
      }
    } catch (error) {
      console.error('Erro ao alterar senha:', error)
      setError("Erro ao alterar senha. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setError(null)
    setSuccess(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center m-2 sm:m-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-[80vw] sm:w-full sm:max-w-md mx-auto max-h-full"
            initial={{ scale: 0.95, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 40 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <button
              onClick={handleClose}
              className="absolute -top-4 -right-4 bg-white rounded-full shadow p-2 text-[#8b4513] hover:bg-[#f4f1eb] hover:text-[#d2691e] transition-colors focus:outline-none border border-[#e8e8e8]"
              aria-label="Fechar"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="bg-white rounded-2xl shadow-2xl border border-[#e8e8e8] p-0 overflow-hidden animate-fadeIn h-auto max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#8b4513] to-[#d2691e] rounded-full flex items-center justify-center">
                    <Lock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#2c3e50]">Alterar Senha</h2>
                    <p className="text-sm text-[#8b4513]">Atualize sua senha de acesso</p>
                  </div>
                </div>

                {success ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lock className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-green-600 mb-2">Senha Alterada!</h3>
                    <p className="text-sm text-[#7f8c8d]">Sua senha foi atualizada com sucesso.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-[#e74c3c] rounded-lg p-4 text-sm text-center shadow-sm">
                        <div className="flex items-center justify-center">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                          {error}
                        </div>
                      </div>
                    )}

                    {/* Senha Atual */}
                    <div>
                      <label className="block text-sm font-semibold text-[#2c3e50] mb-2">
                        Senha Atual
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Digite sua senha atual"
                          className="w-full px-4 py-3 pr-12 border border-[#e8e8e8] rounded-lg focus:ring-2 focus:ring-[#8b4513] focus:border-transparent transition-all duration-200 text-[#2c3e50] placeholder-[#a8a8a8]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#7f8c8d] hover:text-[#2c3e50] transition-colors"
                        >
                          {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Nova Senha */}
                    <div>
                      <label className="block text-sm font-semibold text-[#2c3e50] mb-2">
                        Nova Senha
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Digite a nova senha"
                          className="w-full px-4 py-3 pr-12 border border-[#e8e8e8] rounded-lg focus:ring-2 focus:ring-[#8b4513] focus:border-transparent transition-all duration-200 text-[#2c3e50] placeholder-[#a8a8a8]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#7f8c8d] hover:text-[#2c3e50] transition-colors"
                        >
                          {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirmar Nova Senha */}
                    <div>
                      <label className="block text-sm font-semibold text-[#2c3e50] mb-2">
                        Confirmar Nova Senha
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirme a nova senha"
                          className="w-full px-4 py-3 pr-12 border border-[#e8e8e8] rounded-lg focus:ring-2 focus:ring-[#8b4513] focus:border-transparent transition-all duration-200 text-[#2c3e50] placeholder-[#a8a8a8]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#7f8c8d] hover:text-[#2c3e50] transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Botão Salvar */}
                    <div className="mt-6">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-gradient-to-r from-[#8b4513] to-[#d2691e] text-white font-semibold rounded-lg shadow-natura hover:from-[#a0522d] hover:to-[#8b4513] transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            Alterando...
                          </>
                        ) : (
                          <>
                            <Save className="h-5 w-5 mr-2" />
                            Alterar Senha
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 