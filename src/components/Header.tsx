'use client'

import { motion } from 'framer-motion'
import { Flower, MessageCircle, User, Menu, X } from 'lucide-react'
import { useState } from 'react'
import AdminLoginModal from './AdminLoginModal'
import { useSiteSettings } from '@/hooks/useSiteSettings'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { settings, loading } = useSiteSettings()

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

  return (
    <motion.header 
      className="bg-white/90 backdrop-blur-md border-b border-[#e8e8e8] sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-[#8b4513] to-[#d2691e] rounded-full flex items-center justify-center">
              <Flower className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">
              {loading ? 'Eliza CMS' : settings?.site_name || 'Eliza CMS'}
            </span>
          </motion.div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.button
              onClick={handleWhatsAppClick}
              className="p-2 text-[#25D366] hover:text-[#128C7E] transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Fale conosco no WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </motion.button>
            <div className="p-2">
              <AdminLoginModal />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 text-[#2c3e50]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className="md:hidden"
        variants={menuVariants}
        initial="closed"
        animate={isMenuOpen ? "open" : "closed"}
      >
        <div className="bg-white border-t border-[#e8e8e8] shadow-lg">
          <div className="px-4 py-6 space-y-4">
            <div className="pt-4 border-t border-[#e8e8e8]">
              <motion.button
                onClick={handleWhatsAppClick}
                className="flex items-center space-x-2 text-[#25D366] hover:text-[#128C7E] transition-colors duration-200 font-medium py-2"
                variants={itemVariants}
              >
                <MessageCircle className="w-5 h-5" />
                <span>WhatsApp</span>
              </motion.button>
              <div className="py-2">
                <AdminLoginModal />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.header>
  )
} 