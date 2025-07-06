'use client'

import { motion } from 'framer-motion'
// Nenhuma dessas importações é usada
import { useSiteSettings } from '@/hooks/useSiteSettings'

interface HeroSectionProps {
  productCount?: number
}

export default function HeroSection({ productCount = 0 }: HeroSectionProps) {
  const { settings, loading } = useSiteSettings()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  }

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#f4f1eb] via-white to-[#f8f9fa] py-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-[#8b4513]/10 to-[#d2691e]/10 rounded-full"
          variants={floatingVariants}
          animate="animate"
        />
        <motion.div
          className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-[#d2691e]/10 to-[#8b4513]/10 rounded-full"
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: "1s" }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-12 h-12 bg-gradient-to-br from-[#8b4513]/10 to-[#d2691e]/10 rounded-full"
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main Heading */}
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6"
            variants={itemVariants}
          >
            <span className="gradient-text">
              {loading ? 'Eliza CMS' : settings?.site_name || 'Eliza CMS'}
            </span>
            <br />
            <span className="text-[#2c3e50]">
              {loading ? 'Catálogo de Produtos' : settings?.title || 'Catálogo de Produtos'}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-[#7f8c8d] mb-8 max-w-3xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            {loading ? 'Carregando...' : settings?.subtitle || 'Descubra produtos naturais de qualidade'}
          </motion.p>

          {/* Slogan */}
          {settings?.slogan && (
            <motion.p
              className="text-lg text-[#8b4513] font-medium mb-8 italic"
              variants={itemVariants}
            >
              &quot;{settings.slogan}&quot;
            </motion.p>
          )}

          {/* Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
            variants={itemVariants}
          >
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-2">{productCount}+</div>
              <div className="text-[#7f8c8d]">Produtos no Catálogo</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-2">99.9%</div>
              <div className="text-[#7f8c8d]">Disponibilidade</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-2">24/7</div>
              <div className="text-[#7f8c8d]">Suporte</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
} 