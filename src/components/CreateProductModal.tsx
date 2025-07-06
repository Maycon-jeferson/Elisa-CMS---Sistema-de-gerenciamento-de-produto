'use client'

import { useState } from 'react'
import { supabase, createProduct, uploadImage } from '@/lib/supabase'
import imageCompression from 'browser-image-compression'

interface CreateProductModalProps {
  isOpen: boolean
  onClose: () => void
  onProductCreated: () => void
}

export default function CreateProductModal({ isOpen, onClose, onProductCreated }: CreateProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    in_stock: true
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setImageFile(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.price.trim() || !formData.category.trim()) {
      setError('Nome, preço e categoria são obrigatórios')
      return
    }

    const price = parseFloat(formData.price)
    if (isNaN(price) || price <= 0) {
      setError('Preço deve ser um número válido maior que zero')
      return
    }

    try {
      setLoading(true)
      setError(null)
      let imageUrl = ''
      if (imageFile) {
        setUploading(true)
        // Comprimir imagem
        const compressed = await imageCompression(imageFile, { maxSizeMB: 0.5, maxWidthOrHeight: 800 })
        // Upload para o Supabase Storage
        const fileExt = compressed.name.split('.').pop()
        const fileName = `imagens/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`
        const uploadedUrl = await uploadImage(compressed, fileName)
        if (!uploadedUrl) {
          throw new Error('Erro ao fazer upload da imagem')
        }
        imageUrl = uploadedUrl
        setUploading(false)
      } else if (formData.image) {
        imageUrl = formData.image.trim()
      }
      
      const newProduct = await createProduct({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        price: price,
        category: formData.category.trim(),
        image: imageUrl || undefined,
        in_stock: formData.in_stock
      })

      if (!newProduct) {
        throw new Error('Erro ao criar produto')
      }

      // Limpar formulário
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        image: '',
        in_stock: true
      })
      setImageFile(null)

      // Fechar modal e atualizar lista
      onClose()
      onProductCreated()
    } catch (err) {
      if (err && typeof err === 'object' && 'message' in err) {
        setError(`Erro ao criar produto: ${String(err.message)}`)
      } else {
        setError('Erro desconhecido ao criar produto')
      }
    } finally {
      setLoading(false)
      setUploading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        image: '',
        in_stock: true
      })
      setError(null)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#e8e8e8] w-[80vw] sm:w-full sm:max-w-md max-h-[90vh] overflow-y-auto relative animate-fadeIn">
        <div className="px-6 py-4 border-b border-[#e8e8e8] flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#2c3e50]">Criar Novo Produto</h3>
          <button
            onClick={handleClose}
            disabled={loading}
            className="bg-white rounded-full shadow p-2 text-[#8b4513] hover:bg-[#f4f1eb] hover:text-[#d2691e] transition-colors focus:outline-none border border-[#e8e8e8] disabled:opacity-50"
            aria-label="Fechar"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex">
                <svg className="h-5 w-5 text-[#e74c3c] mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <p className="text-sm text-[#e74c3c]">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#2c3e50] mb-1">
                Nome do Produto *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-[#e8e8e8] rounded-md shadow-sm focus:outline-none focus:ring-[#8b4513] focus:border-[#8b4513] text-[#2c3e50] placeholder:text-[#7f8c8d]"
                placeholder="Digite o nome do produto"
                disabled={loading}
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
                placeholder="Digite a descrição do produto"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-[#2c3e50] mb-1">
                Preço *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-[#7f8c8d]">R$</span>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  min="0"
                  className="w-full pl-8 pr-3 py-2 border border-[#e8e8e8] rounded-md shadow-sm focus:outline-none focus:ring-[#8b4513] focus:border-[#8b4513] text-[#2c3e50] placeholder:text-[#7f8c8d]"
                  placeholder="0,00"
                  disabled={loading}
                />
              </div>
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
                placeholder="Ex: Eletrônicos, Roupas, etc."
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-[#2c3e50] mb-1">
                Imagem do Produto
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-[#e8e8e8] rounded-md shadow-sm focus:outline-none focus:ring-[#8b4513] focus:border-[#8b4513] text-[#2c3e50] placeholder:text-[#7f8c8d]"
                disabled={loading || uploading}
              />
              {uploading && <p className="text-xs text-[#8b4513] mt-1">Enviando imagem...</p>}
              {imageFile && <p className="text-xs text-[#8b4513] mt-1">Imagem selecionada: {imageFile.name}</p>}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="in_stock"
                name="in_stock"
                checked={formData.in_stock}
                onChange={(e) => setFormData(prev => ({ ...prev, in_stock: e.target.checked }))}
                className="h-4 w-4 text-[#8b4513] focus:ring-[#8b4513] border-[#e8e8e8] rounded"
                disabled={loading}
              />
              <label htmlFor="in_stock" className="ml-2 block text-sm text-[#2c3e50]">
                Em estoque
              </label>
            </div>

          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-[#e8e8e8] rounded-full shadow-sm text-sm font-medium text-[#8b4513] bg-white hover:bg-[#f4f1eb] focus:outline-none focus:ring-2 focus:ring-[#8b4513] focus:border-[#8b4513] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 border border-transparent rounded-full shadow-natura text-sm font-semibold text-white bg-gradient-to-r from-[#8b4513] to-[#d2691e] hover:from-[#a0522d] hover:to-[#8b4513] focus:outline-none focus:ring-2 focus:ring-[#8b4513] focus:border-[#8b4513] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Criando...
                </div>
              ) : (
                'Criar Produto'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 