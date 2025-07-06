"use client"

import { useState, useEffect } from "react"
import AdminLoginForm from "./AdminLoginForm"
import { useAuth } from "@/contexts/AuthContext"
import { motion, AnimatePresence } from "framer-motion"
import { X, Settings, Save, Loader2, User, LogOut, Shield } from "lucide-react"
import { loadSiteSettings, saveSiteSettings, updateSiteSettings, SiteSettings } from "@/lib/supabase"
import Link from "next/link"

export default function AdminLoginModal() {
  const { isAuthenticated, currentAdmin, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [currentSettings, setCurrentSettings] = useState<SiteSettings | null>(null)
  const [settings, setSettings] = useState({
    whatsappNumber: '5511999999999',
    siteName: 'Eliza CMS',
    title: 'Catálogo de Produtos Naturais',
    subtitle: 'Descubra produtos naturais de qualidade',
    slogan: 'Naturais como a natureza'
  })

  // Carregar configurações ao abrir o modal
  useEffect(() => {
    if (settingsOpen) {
      loadSettings()
    }
  }, [settingsOpen])

  const loadSettings = async () => {
    setLoading(true)
    try {
      const savedSettings = await loadSiteSettings()
      if (savedSettings) {
        setCurrentSettings(savedSettings)
        setSettings({
          whatsappNumber: savedSettings.whatsapp_number,
          siteName: savedSettings.site_name,
          title: savedSettings.title,
          subtitle: savedSettings.subtitle,
          slogan: savedSettings.slogan
        })
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      const settingsData = {
        whatsapp_number: settings.whatsappNumber,
        site_name: settings.siteName,
        title: settings.title,
        subtitle: settings.subtitle,
        slogan: settings.slogan
      }

      let result
      if (currentSettings) {
        result = await updateSiteSettings(currentSettings.id, settingsData)
      } else {
        result = await saveSiteSettings(settingsData)
      }

      if (result) {
        setCurrentSettings(result)
        alert('Configurações salvas com sucesso!')
        setSettingsOpen(false)
      } else {
        alert('Erro ao salvar configurações.')
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      alert('Erro ao salvar configurações.')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    logout()
    setOpen(false)
    setSettingsOpen(false)
  }

  return (
    <>
      {/* Botão de Admin */}
      {!isAuthenticated ? (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-4 right-4 bg-gradient-to-r from-[#8b4513] to-[#d2691e] text-white p-3 rounded-full shadow-lg hover:from-[#a0522d] hover:to-[#8b4513] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#8b4513] focus:ring-offset-2"
          aria-label="Login do Administrador"
        >
          <User className="h-6 w-6" />
        </button>
      ) : (
        <div className="fixed bottom-4 right-4 flex flex-col gap-2">
          {/* Botão de Configurações */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="bg-gradient-to-r from-[#8b4513] to-[#d2691e] text-white p-3 rounded-full shadow-lg hover:from-[#a0522d] hover:to-[#8b4513] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#8b4513] focus:ring-offset-2"
            aria-label="Configurações"
          >
            <Settings className="h-6 w-6" />
          </button>
          
          {/* Botão de Administração (apenas em desenvolvimento) */}
          {process.env.NODE_ENV === 'development' && (
            <Link
              href="/admin"
              className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Painel de Administração"
              title="Painel de Administração (DEV)"
            >
              <Shield className="h-6 w-6" />
            </Link>
          )}
          
          {/* Botão de Logout */}
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label="Sair"
            title={`Sair (${currentAdmin?.name})`}
          >
            <LogOut className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* Modal de Login */}
      <AnimatePresence>
        {open && (
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
                onClick={() => setOpen(false)}
                className="absolute -top-4 -right-4 bg-white rounded-full shadow p-2 text-[#8b4513] hover:bg-[#f4f1eb] hover:text-[#d2691e] transition-colors focus:outline-none border border-[#e8e8e8]"
                aria-label="Fechar"
              >
                <X className="h-6 w-6" />
              </button>
              <div className="bg-white rounded-2xl shadow-2xl border border-[#e8e8e8] p-0 overflow-hidden animate-fadeIn h-auto max-h-[90vh] overflow-y-auto">
                <AdminLoginForm onSuccess={() => setOpen(false)} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Configurações */}
      <AnimatePresence>
        {settingsOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center m-2 sm:m-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-[80vw] sm:w-full sm:max-w-lg mx-auto max-h-full"
              initial={{ scale: 0.95, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 40 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <button
                onClick={() => setSettingsOpen(false)}
                className="absolute -top-4 -right-4 bg-white rounded-full shadow p-2 text-[#8b4513] hover:bg-[#f4f1eb] hover:text-[#d2691e] transition-colors focus:outline-none border border-[#e8e8e8]"
                aria-label="Fechar"
              >
                <X className="h-6 w-6" />
              </button>
              <div className="bg-white rounded-2xl shadow-2xl border border-[#e8e8e8] p-0 overflow-hidden animate-fadeIn h-auto max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#8b4513] to-[#d2691e] rounded-full flex items-center justify-center">
                      <Settings className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[#2c3e50]">Configurações do Site</h2>
                      <p className="text-sm text-[#8b4513]">Personalize as informações do seu site</p>
                    </div>
                  </div>

                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 text-[#8b4513] animate-spin" />
                      <span className="ml-3 text-[#8b4513]">Carregando configurações...</span>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4">
                        {/* Número do WhatsApp */}
                        <div>
                          <label className="block text-sm font-semibold text-[#2c3e50] mb-2">
                            Número do WhatsApp
                          </label>
                          <input
                            type="text"
                            value={settings.whatsappNumber}
                            onChange={(e) => setSettings(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                            placeholder="5511999999999"
                            className="w-full px-4 py-3 border border-[#e8e8e8] rounded-lg focus:ring-2 focus:ring-[#8b4513] focus:border-transparent transition-all duration-200 text-[#2c3e50] placeholder-[#a8a8a8]"
                          />
                        </div>

                        {/* Nome do Site */}
                        <div>
                          <label className="block text-sm font-semibold text-[#2c3e50] mb-2">
                            Nome do Site
                          </label>
                          <input
                            type="text"
                            value={settings.siteName}
                            onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                            placeholder="Eliza CMS"
                            className="w-full px-4 py-3 border border-[#e8e8e8] rounded-lg focus:ring-2 focus:ring-[#8b4513] focus:border-transparent transition-all duration-200 text-[#2c3e50] placeholder-[#a8a8a8]"
                          />
                        </div>

                        {/* Título */}
                        <div>
                          <label className="block text-sm font-semibold text-[#2c3e50] mb-2">
                            Título Principal
                          </label>
                          <input
                            type="text"
                            value={settings.title}
                            onChange={(e) => setSettings(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Catálogo de Produtos Naturais"
                            className="w-full px-4 py-3 border border-[#e8e8e8] rounded-lg focus:ring-2 focus:ring-[#8b4513] focus:border-transparent transition-all duration-200 text-[#2c3e50] placeholder-[#a8a8a8]"
                          />
                        </div>

                        {/* Subtítulo */}
                        <div>
                          <label className="block text-sm font-semibold text-[#2c3e50] mb-2">
                            Subtítulo
                          </label>
                          <input
                            type="text"
                            value={settings.subtitle}
                            onChange={(e) => setSettings(prev => ({ ...prev, subtitle: e.target.value }))}
                            placeholder="Descubra produtos naturais de qualidade"
                            className="w-full px-4 py-3 border border-[#e8e8e8] rounded-lg focus:ring-2 focus:ring-[#8b4513] focus:border-transparent transition-all duration-200 text-[#2c3e50] placeholder-[#a8a8a8]"
                          />
                        </div>

                        {/* Slogan */}
                        <div>
                          <label className="block text-sm font-semibold text-[#2c3e50] mb-2">
                            Slogan
                          </label>
                          <input
                            type="text"
                            value={settings.slogan}
                            onChange={(e) => setSettings(prev => ({ ...prev, slogan: e.target.value }))}
                            placeholder="Naturais como a natureza"
                            className="w-full px-4 py-3 border border-[#e8e8e8] rounded-lg focus:ring-2 focus:ring-[#8b4513] focus:border-transparent transition-all duration-200 text-[#2c3e50] placeholder-[#a8a8a8]"
                          />
                        </div>
                      </div>

                      {/* Botão Salvar */}
                      <div className="mt-6">
                        <button
                          onClick={handleSaveSettings}
                          disabled={saving}
                          className="w-full py-3 px-4 bg-gradient-to-r from-[#8b4513] to-[#d2691e] text-white font-semibold rounded-lg shadow-natura hover:from-[#a0522d] hover:to-[#8b4513] transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
                        >
                          {saving ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin mr-2" />
                              Salvando...
                            </>
                          ) : (
                            <>
                              <Save className="h-5 w-5 mr-2" />
                              Salvar Configurações
                            </>
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 