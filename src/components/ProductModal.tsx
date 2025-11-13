// src/components/ProductModal.tsx
import type { Product } from '@/types/product'
import { X } from 'lucide-react'
import { useState } from 'react'

interface ProductModalProps {
  product: Product
  onClose: () => void
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const [currentImage, setCurrentImage] = useState(0)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-2xl font-title font-bold">{product.nome}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-4">
                <img
                  src={product.imagens_urls?.[currentImage] || product.imagem_url}
                  alt={product.nome}
                  className="w-full h-full object-contain"
                />
              </div>
              {product.imagens_urls && product.imagens_urls.length > 1 && (
                <div className="flex gap-2">
                  {product.imagens_urls.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        i === currentImage ? 'border-primary' : 'border-gray-200'
                      }`}
                    >
                      <img src={url} alt={`${product.nome} ${i + 1}`} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <p className="text-sm text-text-secondary mb-2">Código: {product.id}</p>
              {product.descricao && (
                <p className="text-text-secondary mb-4">{product.descricao}</p>
              )}
              
              {product.categorias && product.categorias.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Categorias</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.categorias.map((cat) => (
                      <span key={cat} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {product.variacoes && product.variacoes.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Cores disponíveis</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.variacoes.map((v) => (
                      <span key={v} className="border border-gray-300 px-3 py-1 rounded-full text-sm">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button className="w-full bg-primary hover:opacity-90 text-text-primary font-bold py-3 rounded-lg mt-6">
                Solicitar Orçamento
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}