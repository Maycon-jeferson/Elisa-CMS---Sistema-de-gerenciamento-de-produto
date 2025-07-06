'use client'

import { useState, useEffect } from 'react'
import ProductsTable from '@/components/ProductsTable'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import TestConnection from '@/components/TestConnection'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [productCount, setProductCount] = useState(0)
  const [showTest, setShowTest] = useState(false)

  useEffect(() => {
    fetchProductCount()
  }, [])

  const fetchProductCount = async () => {
    try {
      const { count, error } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      if (error) {
        console.error('Erro ao buscar contagem de produtos:', error)
        return
      }

      setProductCount(count || 0)
    } catch (err) {
      console.error('Erro ao buscar contagem de produtos:', err)
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection productCount={productCount} />
      
      {/* Botão de teste (apenas em desenvolvimento) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => setShowTest(!showTest)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showTest ? 'Ocultar Teste' : 'Mostrar Teste de Conexão'}
          </button>
        </div>
      )}

      {/* Componente de teste */}
      {showTest && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <TestConnection />
        </div>
      )}

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductsTable />
        </div>
      </section>
    </div>
  )
}
