'use client'

import { useState, useEffect } from 'react'
import { supabase, Product } from '@/lib/supabase'
import Image from 'next/image'

export default function ImageDebug() {
  const [debugInfo, setDebugInfo] = useState<string>('')
  const [products, setProducts] = useState<Product[]>([])

  const checkImages = async () => {
    setDebugInfo('🔍 Verificando imagens dos produtos...\n\n')

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        setDebugInfo(prev => prev + `❌ Erro ao carregar produtos: ${error.message}\n`)
        return
      }

      setProducts(data || [])
      setDebugInfo(prev => prev + `✅ ${data?.length || 0} produtos carregados\n\n`)

      if (data && data.length > 0) {
        setDebugInfo(prev => prev + '📋 Dados dos produtos:\n')
        data.forEach((product, index) => {
          setDebugInfo(prev => prev + `\n${index + 1}. ${product.name}:\n`)
          setDebugInfo(prev => prev + `   - ID: ${product.id}\n`)
          setDebugInfo(prev => prev + `   - Image: ${product.image || 'null'}\n`)
          setDebugInfo(prev => prev + `   - Image type: ${typeof product.image}\n`)
          setDebugInfo(prev => prev + `   - Has image: ${!!product.image}\n`)
          
          // Verificar se o campo image existe
          if ('image' in product) {
            setDebugInfo(prev => prev + `   - ✅ Campo 'image' existe\n`)
          } else {
            setDebugInfo(prev => prev + `   - ❌ Campo 'image' NÃO existe\n`)
          }
        })
      } else {
        setDebugInfo(prev => prev + '📭 Nenhum produto encontrado\n')
      }

    } catch (err) {
      setDebugInfo(prev => prev + `❌ Erro: ${err && typeof err === 'object' && 'message' in err ? String(err.message) : 'Erro desconhecido'}\n`)
    }
  }

  const testImageUrl = async (url: string) => {
    setDebugInfo(prev => prev + `\n🔗 Testando URL: ${url}\n`)
    
    try {
      const response = await fetch(url, { method: 'HEAD' })
      if (response.ok) {
        setDebugInfo(prev => prev + `✅ URL válida (Status: ${response.status})\n`)
      } else {
        setDebugInfo(prev => prev + `❌ URL inválida (Status: ${response.status})\n`)
      }
    } catch (err) {
      setDebugInfo(prev => prev + `❌ Erro ao testar URL: ${err && typeof err === 'object' && 'message' in err ? String(err.message) : 'Erro desconhecido'}\n`)
    }
  }

  useEffect(() => {
    checkImages()
  }, [])

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">🖼️ Debug de Imagens</h3>
      
      <button
        onClick={checkImages}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mb-4"
      >
        🔄 Verificar Novamente
      </button>

      {debugInfo && (
        <div className="bg-gray-50 p-4 rounded-md mb-4">
          <h4 className="font-medium text-gray-900 mb-2">📋 Debug Info:</h4>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">{debugInfo}</pre>
        </div>
      )}

      {products.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium text-gray-900 mb-2">🖼️ Produtos com Imagens:</h4>
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                <h5 className="font-medium text-gray-900">{product.name}</h5>
                <p className="text-sm text-gray-600">ID: {product.id}</p>
                <p className="text-sm text-gray-600">Image: {product.image || 'null'}</p>
                
                {product.image && (
                  <div className="mt-2 relative h-20 w-20">
                    <Image
                      src={product.image || '/fallback.png'}
                      alt={product.name}
                      fill
                      className="object-cover rounded border"
                      style={{ objectFit: 'cover' }}
                      sizes="80px"
                      priority={false}
                    />
                    <button
                      onClick={() => testImageUrl(product.image || '')}
                      className="mt-1 text-xs text-blue-600 hover:text-blue-800"
                    >
                      Testar URL
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 