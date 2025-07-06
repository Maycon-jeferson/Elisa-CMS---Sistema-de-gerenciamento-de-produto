'use client'

import { useState, useEffect } from 'react'
import { Product, updateProduct } from '@/lib/supabase'

interface EditProductModalProps {
  isOpen: boolean
  onClose: () => void
  onProductUpdated: () => void
  product: Product | null
}

export default function EditProductModal({ isOpen, onClose, onProductUpdated, product }: EditProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    in_stock: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        category: product.category || '',
        image: product.image || '',
        in_stock: product.in_stock || false
      })
    }
  }, [product])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return

    try {
      setLoading(true)
      setError(null)

      // Validação dos dados
      if (!formData.name.trim()) {
        throw new Error('Nome é obrigatório')
      }

      if (!formData.category.trim()) {
        throw new Error('Categoria é obrigatória')
      }

      const price = parseFloat(formData.price)
      if (isNaN(price) || price < 0) {
        throw new Error('Preço deve ser um número válido maior ou igual a zero')
      }

      // Preparar dados para atualização
      const updateData: Partial<Omit<Product, 'id'>> = {
        name: formData.name.trim(),
        price: price,
        category: formData.category.trim(),
        in_stock: formData.in_stock
      }

      // Adicionar campos opcionais apenas se tiverem valores válidos
      if (formData.description.trim()) {
        updateData.description = formData.description.trim()
      }

      if (formData.image.trim()) {
        updateData.image = formData.image.trim()
      }

      const updatedProduct = await updateProduct(product.id, updateData)

      if (!updatedProduct) {
        throw new Error('Erro ao atualizar produto')
      }

      onProductUpdated()
      onClose()
    } catch (err) {
      setError(err && typeof err === 'object' && 'message' in err ? String(err.message) : 'Erro ao atualizar produto')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  if (!isOpen || !product) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#e8e8e8] max-w-md w-full max-h-[90vh] overflow-y-auto relative animate-fadeIn">
        <div className="px-6 py-4 border-b border-[#e8e8e8] flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#2c3e50]">Editar Produto</h2>
          <button
            onClick={onClose}
            className="bg-white rounded-full shadow p-2 text-[#8b4513] hover:bg-[#f4f1eb] hover:text-[#d2691e] transition-colors focus:outline-none border border-[#e8e8e8]"
            aria-label="Fechar"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-[#e74c3c]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-[#e74c3c]">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#2c3e50] mb-1">
              Nome *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-[#e8e8e8] rounded-md shadow-sm focus:outline-none focus:ring-[#8b4513] focus:border-[#8b4513] text-[#2c3e50] placeholder:text-[#7f8c8d]"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-[#2c3e50] mb-1">
              Descrição
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-[#e8e8e8] rounded-md shadow-sm focus:outline-none focus:ring-[#8b4513] focus:border-[#8b4513] text-[#2c3e50] placeholder:text-[#7f8c8d]"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-[#2c3e50] mb-1">
              Preço *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-[#e8e8e8] rounded-md shadow-sm focus:outline-none focus:ring-[#8b4513] focus:border-[#8b4513] text-[#2c3e50] placeholder:text-[#7f8c8d]"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-[#2c3e50] mb-1">
              Categoria *
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-[#e8e8e8] rounded-md shadow-sm focus:outline-none focus:ring-[#8b4513] focus:border-[#8b4513] text-[#2c3e50] placeholder:text-[#7f8c8d]"
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-[#2c3e50] mb-1">
              URL da Imagem
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-[#e8e8e8] rounded-md shadow-sm focus:outline-none focus:ring-[#8b4513] focus:border-[#8b4513] text-[#2c3e50] placeholder:text-[#7f8c8d]"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="in_stock"
              name="in_stock"
              checked={formData.in_stock}
              onChange={handleInputChange}
              className="h-4 w-4 text-[#8b4513] focus:ring-[#8b4513] border-[#e8e8e8] rounded"
            />
            <label htmlFor="in_stock" className="ml-2 block text-sm text-[#2c3e50]">
              Em estoque
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#e8e8e8] rounded-full shadow-sm text-sm font-medium text-[#8b4513] bg-white hover:bg-[#f4f1eb] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8b4513] transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-full shadow-natura text-sm font-semibold text-white bg-gradient-to-r from-[#8b4513] to-[#d2691e] hover:from-[#a0522d] hover:to-[#8b4513] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8b4513] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 