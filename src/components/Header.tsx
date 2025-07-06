'use client'

import { motion } from 'framer-motion'
import { Flower, MessageCircle, Menu, X, User, Settings, Shield, LogOut, Lock } from 'lucide-react'
import { useState } from 'react'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import AdminLoginModal from './AdminLoginModal'
import ChangePasswordModal from './ChangePasswordModal'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const { settings, loading } = useSiteSettings()
  const { isAuthenticated, currentAdmin, logout } = useAuth()

  const menuVariants = {
    closed: {
      opacity: 0,
      x: -300,
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const
      }
    }
  }

  const itemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 }
  }

  const handleWhatsAppClick = () => {
    const phoneNumber = settings?.whatsapp_number || '5511999999999'
    const message = 'Olá! Gostaria de saber mais sobre os produtos.'
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <>
      <motion.header 
        className="bg-white/90 backdrop-blur-md border-b border-[#e8e8e8] sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-1 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-10">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-1"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-6 h-6 bg-gradient-to-br from-[#8b4513] to-[#d2691e] rounded-full flex items-center justify-center">
                <Flower className="w-3 h-3 text-white" />
              </div>
              <span className="text-base font-bold gradient-text leading-none">
                {loading ? 'Eliza CMS' : settings?.site_name || 'Eliza CMS'}
              </span>
            </motion.div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-2 h-full">
              {/* WhatsApp */}
              <motion.button
                onClick={handleWhatsAppClick}
                className="p-0 w-8 h-8 flex items-center justify-center text-[#25D366] hover:text-[#128C7E] transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title="Fale conosco no WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </motion.button>

              {/* Admin Actions */}
              {!isAuthenticated ? (
                <motion.button
                  onClick={() => setIsLoginOpen(true)}
                  className="p-0 w-8 h-8 flex items-center justify-center text-[#8b4513] hover:text-[#d2691e] transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title="Login do Administrador"
                >
                  <User className="w-4 h-4" />
                </motion.button>
              ) : (
                <>
                  {/* Configurações */}
                  <motion.button
                    onClick={() => setIsSettingsOpen(true)}
                    className="p-0 w-8 h-8 flex items-center justify-center text-[#8b4513] hover:text-[#d2691e] transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title="Configurações do Site"
                  >
                    <Settings className="w-4 h-4" />
                  </motion.button>
                  
                  {/* Alterar Senha */}
                  <motion.button
                    onClick={() => setIsChangePasswordOpen(true)}
                    className="p-0 w-8 h-8 flex items-center justify-center text-[#8b4513] hover:text-[#d2691e] transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title="Alterar Senha"
                  >
                    <Lock className="w-4 h-4" />
                  </motion.button>
                  
                  {/* Painel de Administração (apenas em desenvolvimento) */}
                  {process.env.NODE_ENV === 'development' && (
                    <Link
                      href="/admin"
                      className="p-0 w-8 h-8 flex items-center justify-center text-blue-600 hover:text-blue-700 transition-colors duration-200"
                      title="Painel de Administração (DEV)"
                    >
                      <Shield className="w-4 h-4" />
                    </Link>
                  )}
                  
                  {/* Logout */}
                  <motion.button
                    onClick={handleLogout}
                    className="p-0 w-8 h-8 flex items-center justify-center text-red-600 hover:text-red-700 transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title={`Sair (${currentAdmin?.name})`}
                  >
                    <LogOut className="w-4 h-4" />
                  </motion.button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden p-0 w-8 h-8 flex items-center justify-center text-[#2c3e50]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          className={`md:hidden ${!isMenuOpen ? 'hidden' : ''}`}
          variants={menuVariants}
          initial="closed"
          animate={isMenuOpen ? "open" : "closed"}
        >
          <div className="bg-white border-t border-[#e8e8e8] shadow-lg">
            <div className="px-4 py-4 space-y-2">
              <div className="pt-2 border-t border-[#e8e8e8]">
                <motion.button
                  onClick={handleWhatsAppClick}
                  className="flex items-center space-x-2 text-[#25D366] hover:text-[#128C7E] transition-colors duration-200 font-medium py-2"
                  variants={itemVariants}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp</span>
                </motion.button>
              </div>

              {/* Admin Actions Mobile */}
              {!isAuthenticated ? (
                <motion.div
                  className="pt-2 border-t border-[#e8e8e8]"
                  variants={itemVariants}
                >
                  <button 
                    onClick={() => setIsLoginOpen(true)}
                    className="flex items-center space-x-2 text-[#8b4513] hover:text-[#d2691e] transition-colors duration-200 font-medium py-2"
                  >
                    <User className="w-5 h-5" />
                    <span>Login Admin</span>
                  </button>
                </motion.div>
              ) : (
                <>
                  <motion.div
                    className="pt-2 border-t border-[#e8e8e8]"
                    variants={itemVariants}
                  >
                    <button 
                      onClick={() => setIsSettingsOpen(true)}
                      className="flex items-center space-x-2 text-[#8b4513] hover:text-[#d2691e] transition-colors duration-200 font-medium py-2"
                    >
                      <Settings className="w-5 h-5" />
                      <span>Configurações</span>
                    </button>
                  </motion.div>
                  
                  <motion.div
                    className="pt-2 border-t border-[#e8e8e8]"
                    variants={itemVariants}
                  >
                    <button 
                      onClick={() => setIsChangePasswordOpen(true)}
                      className="flex items-center space-x-2 text-[#8b4513] hover:text-[#d2691e] transition-colors duration-200 font-medium py-2"
                    >
                      <Lock className="w-5 h-5" />
                      <span>Alterar Senha</span>
                    </button>
                  </motion.div>
                  
                  {process.env.NODE_ENV === 'development' && (
                    <motion.div
                      className="pt-2 border-t border-[#e8e8e8]"
                      variants={itemVariants}
                    >
                      <Link href="/admin" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors duration-200 font-medium py-2">
                        <Shield className="w-5 h-5" />
                        <span>Painel Admin</span>
                      </Link>
                    </motion.div>
                  )}
                  
                  <motion.div
                    className="pt-2 border-t border-[#e8e8e8]"
                    variants={itemVariants}
                  >
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors duration-200 font-medium py-2"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sair ({currentAdmin?.name})</span>
                    </button>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </motion.header>

      {/* Modais */}
      <AdminLoginModal
        isLoginOpen={isLoginOpen}
        isSettingsOpen={isSettingsOpen}
        onLoginClose={() => setIsLoginOpen(false)}
        onSettingsClose={() => setIsSettingsOpen(false)}
      />
      
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </>
  )
} 