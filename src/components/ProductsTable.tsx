'use client'

import { useState, useEffect } from 'react'
import { supabase, Product } from '@/lib/supabase'
import CreateProductModal from './CreateProductModal'
import EditProductModal from './EditProductModal'
import ImageModal from './ImageModal'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'

export default function ProductsTable() {
  const { isAuthenticated } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editModal, setEditModal] = useState<{
    isOpen: boolean
    product: Product | null
  }>({
    isOpen: false,
    product: null
  })
  const [imageModal, setImageModal] = useState<{
    isOpen: boolean
    imageUrl: string
    productName: string
  }>({
    isOpen: false,
    imageUrl: '',
    productName: ''
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setProducts(data || [])
    } catch (err) {
      setError(err && typeof err === 'object' && 'message' in err ? String(err.message) : 'Erro ao carregar produtos')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const handleProductCreated = () => {
    fetchProducts()
  }

  const handleProductUpdated = () => {
    fetchProducts()
  }

  const handleEditProduct = (product: Product) => {
    setEditModal({
      isOpen: true,
      product
    })
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) {
        throw error
      }

      fetchProducts()
    } catch (err) {
      alert('Erro ao deletar produto')
    }
  }

  const handleImageClick = (imageUrl: string, productName: string) => {
    setImageModal({
      isOpen: true,
      imageUrl,
      productName
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Erro ao carregar produtos</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Produtos</h2>
            <p className="mt-1 text-sm text-gray-600">
              Total de {products.length} produto{products.length !== 1 ? 's' : ''}
            </p>
          </div>
          {isAuthenticated && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Novo Produto
            </button>
          )}
        </div>
      </div>
      
      <div className="p-6">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-lg font-medium text-gray-900">Nenhum produto encontrado</p>
            <p className="text-sm text-gray-600">Adicione produtos para começar</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow relative">
                {/* Imagem do Produto */}
                <div className="relative w-full h-48">
                  <Image
                    src={product.image || '/fallback.png'}
                    alt={product.name}
                    fill
                    className="object-cover rounded-t-lg cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => handleImageClick(product.image!, product.name)}
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 25vw"
                    priority={true}
                  />
                  {/* Badge de Status */}
                  <div className="absolute top-2 right-2">
                    {product.in_stock ? (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Em estoque
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        Sem estoque
                      </span>
                    )}
                  </div>
                  {/* Badge de Categoria */}
                  <div className="absolute top-2 left-2">
                    {product.category && (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {product.category}
                      </span>
                    )}
                  </div>
                </div>
                {/* Conteúdo do Card */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                  {product.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  )}
                  {/* Preço */}
                  <div className="text-xl font-bold text-gray-900 mb-3">
                    {formatPrice(product.price)}
                  </div>
                  {/* Informações Adicionais */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      {product.stock !== null ? `${product.stock} em estoque` : 'Estoque não informado'}
                    </div>
                    {product.rating !== null && (
                      <div className="flex items-center">
                        <svg className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {product.rating}/5
                      </div>
                    )}
                  </div>
                  {/* Data de Criação */}
                  <div className="text-xs text-gray-400 mb-3">
                    Criado em {formatDate(product.created_at)}
                  </div>
                  {/* Botões de Ação - Apenas para administradores */}
                  {isAuthenticated && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id.toString())}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-red-300 shadow-sm text-xs font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                      >
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Excluir
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProductCreated={handleProductCreated}
      />

      <EditProductModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal(prev => ({ ...prev, isOpen: false }))}
        onProductUpdated={handleProductUpdated}
        product={editModal.product}
      />

      <ImageModal
        isOpen={imageModal.isOpen}
        onClose={() => setImageModal(prev => ({ ...prev, isOpen: false }))}
        imageUrl={imageModal.imageUrl}
        productName={imageModal.productName}
      />
    </div>
  )
} 