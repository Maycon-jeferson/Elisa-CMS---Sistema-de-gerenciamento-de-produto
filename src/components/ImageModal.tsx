'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { MessageCircle, Package, Star, Calendar, X } from 'lucide-react'
import { Product } from '@/lib/supabase'
import { useSiteSettings } from '@/hooks/useSiteSettings'

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
}

export default function ImageModal({ isOpen, onClose, product }: ImageModalProps) {
  const { settings } = useSiteSettings()

  if (!isOpen || !product) return null

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const handleWhatsAppClick = () => {
    const phoneNumber = settings?.whatsapp_number || '5511999999999'
    const message = `Olá! 😊\nTenho interesse no produto ${product.name}, que está no valor de ${formatPrice(product.price)}.\nPoderia me passar mais informações?`
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 m-2 sm:m-4">
      <motion.div 
        className="relative w-full max-w-full sm:max-w-2xl max-h-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white rounded-2xl shadow-natura overflow-hidden flex flex-col h-auto max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[#e8e8e8] bg-gradient-to-r from-[#f4f1eb] to-white">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#2c3e50]">{product.name}</h3>
              <motion.button
                onClick={onClose}
                className="text-[#7f8c8d] hover:text-[#2c3e50] transition-colors p-2 rounded-full hover:bg-[#f4f1eb]"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="h-6 w-6" />
              </motion.button>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto">
            {/* Imagem */}
            <div className="lg:w-1/2 p-4 sm:p-6 flex items-center justify-center">
              <div className="relative w-full h-48 sm:h-64 md:h-72 lg:h-[40vh] flex items-center justify-center bg-gradient-to-br from-[#f4f1eb] to-white rounded-xl">
                <Image
                  src={product.image || '/fallback.png'}
                  alt={product.name}
                  fill
                  className="object-contain rounded-lg shadow-natura"
                  style={{ objectFit: 'contain' }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={true}
                />
              </div>
            </div>

            {/* Detalhes do Produto */}
            <div className="lg:w-1/2 p-4 sm:p-6 bg-white flex flex-col justify-center">
              <div className="space-y-6">
                {/* Nome e Preço */}
                <div>
                  <h2 className="text-2xl font-bold text-[#2c3e50] mb-2">{product.name}</h2>
                  <div className="text-3xl font-bold gradient-text">
                    {formatPrice(product.price)}
                  </div>
                </div>

                {/* Descrição */}
                {product.description && (
                  <div>
                    <h4 className="text-lg font-semibold text-[#2c3e50] mb-2">Descrição</h4>
                    <p className="text-[#7f8c8d] leading-relaxed">{product.description}</p>
                  </div>
                )}

                {/* Categoria */}
                {product.category && (
                  <div>
                    <h4 className="text-lg font-semibold text-[#2c3e50] mb-2">Categoria</h4>
                    <span className="inline-flex px-4 py-2 text-sm font-semibold rounded-full bg-[#8b4513]/10 text-[#8b4513] border border-[#8b4513]/20">
                      {product.category}
                    </span>
                  </div>
                )}

                {/* Status do Estoque */}
                <div>
                  <h4 className="text-lg font-semibold text-[#2c3e50] mb-2">Disponibilidade</h4>
                  <div className="flex items-center space-x-3">
                    {product.in_stock ? (
                      <span className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full bg-[#27ae60]/10 text-[#27ae60] border border-[#27ae60]/20">
                        <div className="w-2 h-2 bg-[#27ae60] rounded-full mr-2"></div>
                        Em estoque
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full bg-[#e74c3c]/10 text-[#e74c3c] border border-[#e74c3c]/20">
                        <div className="w-2 h-2 bg-[#e74c3c] rounded-full mr-2"></div>
                        Sem estoque
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantidade em Estoque */}
                {product.stock !== null && (
                  <div>
                    <h4 className="text-lg font-semibold text-[#2c3e50] mb-2">Quantidade</h4>
                    <div className="flex items-center text-[#7f8c8d]">
                      <Package className="h-5 w-5 mr-2 text-[#8b4513]" />
                      <span>{product.stock} unidades disponíveis</span>
                    </div>
                  </div>
                )}

                {/* Avaliação */}
                {product.rating !== null && (
                  <div>
                    <h4 className="text-lg font-semibold text-[#2c3e50] mb-2">Avaliação</h4>
                    <div className="flex items-center">
                      <div className="flex items-center mr-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            className={`h-5 w-5 ${
                              star <= product.rating! 
                                ? 'text-[#f39c12] fill-current' 
                                : 'text-[#e8e8e8]'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[#7f8c8d] font-medium">{product.rating}/5</span>
                    </div>
                  </div>
                )}

                {/* Data de Criação */}
                <div>
                  <h4 className="text-lg font-semibold text-[#2c3e50] mb-2">Data de Cadastro</h4>
                  <div className="flex items-center text-[#7f8c8d]">
                    <Calendar className="h-5 w-5 mr-2 text-[#8b4513]" />
                    <span>{formatDate(product.created_at)}</span>
                  </div>
                </div>

                {/* Botão WhatsApp */}
                <motion.button
                  onClick={handleWhatsAppClick}
                  className="w-full inline-flex items-center justify-center px-6 py-4 border border-transparent text-lg font-semibold rounded-full shadow-natura text-white bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#128C7E] hover:to-[#075E54] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366] transition-all duration-300 hover-lift"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageCircle className="h-6 w-6 mr-3" />
                  Solicitar Informações no WhatsApp
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 