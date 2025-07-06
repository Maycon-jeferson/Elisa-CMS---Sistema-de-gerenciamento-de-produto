'use client'

import Image from 'next/image'

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  productName: string
}

export default function ImageModal({ isOpen, onClose, imageUrl, productName }: ImageModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-4xl max-h-[90vh] w-full">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{productName}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex justify-center">
              <div className="relative w-full h-[60vh] flex items-center justify-center">
                <Image
                  src={imageUrl || '/fallback.png'}
                  alt={productName}
                  fill
                  className="object-contain rounded shadow-lg"
                  style={{ objectFit: 'contain' }}
                  sizes="(max-width: 768px) 100vw, 60vw"
                  priority={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 