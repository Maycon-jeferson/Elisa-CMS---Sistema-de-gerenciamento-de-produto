'use client'

import { useState, useEffect } from 'react'
import ProductsTable from '@/components/ProductsTable'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [productCount, setProductCount] = useState(0)

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
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductsTable />
        </div>
      </section>
    </div>
  )
}
