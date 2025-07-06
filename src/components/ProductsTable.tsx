'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Package, Star, Calendar, Trash2, Edit, Eye } from 'lucide-react'
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
    product: Product | null
  }>({
    isOpen: false,
    product: null
  })
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

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

  const handleImageClick = (product: Product) => {
    setImageModal({
      isOpen: true,
      product
    })
  }

  // Extrair categorias únicas dos produtos
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))]

  // Filtrar produtos por categoria
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory)

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <motion.div 
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8b4513]"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    )
  }

  if (error) {
    return (
      <motion.div 
        className="bg-red-50 border border-red-200 rounded-lg p-6 shadow-natura"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
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
      </motion.div>
    )
  }

  return (
    <motion.div 
      className="bg-white shadow-natura rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="px-8 py-6 border-b border-[#e8e8e8] bg-gradient-to-r from-[#f4f1eb] to-white">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-[#8b4513] to-[#d2691e] text-white shadow-natura'
                    : 'bg-white text-[#2c3e50] hover:bg-[#f4f1eb] hover:text-[#8b4513] border border-[#e8e8e8]'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category === 'all' ? 'Todos' : category}
              </motion.button>
            ))}
          </div>
          {isAuthenticated && (
            <motion.button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-full shadow-natura text-white bg-gradient-to-r from-[#8b4513] to-[#d2691e] hover:from-[#a0522d] hover:to-[#8b4513] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8b4513] transition-all duration-300 hover-lift"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="h-5 w-5 mr-2" />
              Novo Produto
            </motion.button>
          )}
        </div>
      </div>


      
      <div className="p-8">
        {products.length === 0 ? (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-[#f4f1eb] to-[#e8e8e8] rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-12 w-12 text-[#8b4513]" />
            </div>
            <h3 className="text-2xl font-bold text-[#2c3e50] mb-3">Nenhum produto encontrado</h3>
            <p className="text-[#7f8c8d] mb-6">Comece adicionando produtos naturais ao seu catálogo</p>
            {isAuthenticated && (
              <motion.button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-6 py-3 border-2 border-[#8b4513] text-[#8b4513] rounded-full font-semibold hover:bg-[#8b4513] hover:text-white transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="h-5 w-5 mr-2" />
                Adicionar Primeiro Produto
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {filteredProducts.map((product, index) => (
              <motion.div 
                key={product.id} 
                className="bg-white border border-[#e8e8e8] rounded-2xl shadow-natura hover-lift relative overflow-hidden group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {/* Imagem do Produto */}
                <div className="relative w-full h-48">
                  <Image
                    src={product.image || '/fallback.png'}
                    alt={product.name}
                    fill
                    className="object-cover rounded-t-lg cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => handleImageClick(product)}
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 25vw"
                    priority={true}
                  />
                  {/* Badge de Status */}
                  <div className="absolute top-3 right-3">
                    {product.in_stock ? (
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-[#27ae60]/90 text-white backdrop-blur-sm shadow-sm">
                        Em estoque
                      </span>
                    ) : (
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-[#e74c3c]/90 text-white backdrop-blur-sm shadow-sm">
                        Sem estoque
                      </span>
                    )}
                  </div>
                  {/* Badge de Categoria */}
                  <div className="absolute top-3 left-3">
                    {product.category && (
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-[#8b4513]/90 text-white backdrop-blur-sm shadow-sm">
                        {product.category}
                      </span>
                    )}
                  </div>
                </div>
                {/* Conteúdo do Card */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#2c3e50] mb-3 group-hover:text-[#8b4513] transition-colors duration-300">{product.name}</h3>
                  {product.description && (
                    <p className="text-sm text-[#7f8c8d] mb-4 line-clamp-2 leading-relaxed">{product.description}</p>
                  )}
                  {/* Preço */}
                  <div className="text-2xl font-bold gradient-text mb-4">
                    {formatPrice(product.price)}
                  </div>
                  {/* Informações Adicionais */}
                  <div className="flex items-center justify-between text-sm text-[#7f8c8d] mb-4">
                    <div className="flex items-center">
                      <Package className="h-4 w-4 mr-2 text-[#8b4513]" />
                      {product.stock !== null ? `${product.stock} em estoque` : 'Estoque não informado'}
                    </div>
                    {product.rating !== null && (
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-[#f39c12] mr-1 fill-current" />
                        {product.rating}/5
                      </div>
                    )}
                  </div>
                  {/* Data de Criação */}
                  <div className="flex items-center text-xs text-[#7f8c8d] mb-4">
                    <Calendar className="h-3 w-3 mr-1" />
                    Criado em {formatDate(product.created_at)}
                  </div>
                  {/* Botões de Ação - Apenas para administradores */}
                  {isAuthenticated && (
                    <div className="flex space-x-3">
                      <motion.button
                        onClick={() => handleImageClick(product)}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-[#8b4513] text-[#8b4513] rounded-full text-sm font-medium hover:bg-[#8b4513] hover:text-white transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Visualizar
                      </motion.button>
                      <motion.button
                        onClick={() => handleEditProduct(product)}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-[#8b4513] text-[#8b4513] rounded-full text-sm font-medium hover:bg-[#8b4513] hover:text-white transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </motion.button>
                      <motion.button
                        onClick={() => handleDeleteProduct(product.id.toString())}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-[#e74c3c] text-[#e74c3c] rounded-full text-sm font-medium hover:bg-[#e74c3c] hover:text-white transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
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
        product={imageModal.product}
      />
    </motion.div>
  )
} 