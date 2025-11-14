// src/components/ProductModal.tsx
import { useState, useMemo } from 'react'
import { X, ShoppingCart } from 'lucide-react'
import OptimizedImage from './OptimizedImage'
import type { Product, ProductVariation } from '@/types/product'
import { useProductStore } from '@/store/useProductStore'

interface ProductModalProps {
  product: Product
  onClose: () => void
}

interface GalleryItem {
  label: string
  original: string
  thumb: string
  variation?: ProductVariation
  isMain: boolean
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { addToCart } = useProductStore()

  const galleryItems = useMemo<GalleryItem[]>(() => {
    const items: GalleryItem[] = []

    if (product.imagem_url) {
      items.push({
        label: 'Principal',
        original: product.imagem_url,
        thumb: product.thumb_url || product.imagem_url,
        isMain: true,
      })
    }

    if (product.variacoes && product.variacoes.length > 0) {
      product.variacoes.forEach((v) => {
        if (!v.imagem_url && !v.thumb_url) return
        items.push({
          label: v.cor,
          original: v.imagem_url,
          thumb: v.thumb_url || v.imagem_url,
          variation: v,
          isMain: false,
        })
      })
    }

    if (items.length === 0 && product.imagens_urls?.length) {
      product.imagens_urls.forEach((url, idx) => {
        items.push({
          label: idx === 0 ? 'Imagem' : `Imagem ${idx + 1}`,
          original: url,
          thumb: product.thumbs_urls?.[idx] || url,
          isMain: idx === 0,
        })
      })
    }

    return items
  }, [product])

  const [activeIndex, setActiveIndex] = useState(0)
  const activeItem = galleryItems[activeIndex] || galleryItems[0]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-black/70 text-white rounded-full p-2 z-10 hover:bg-black"
        >
          <X size={18} />
        </button>

        <div className="grid md:grid-cols-[1.2fr_1fr] gap-0 md:gap-6 h-full">
          <div className="bg-gray-50 flex flex-col">
            <div className="flex-1 flex items-center justify-center p-4">
              {activeItem && (
                <OptimizedImage
                  src={activeItem.original}
                  alt={`${product.nome} - ${activeItem.label}`}
                  width={800}
                  quality={85}
                  priority={true}
                  className="max-h-[340px] md:max-h-[560px] w-auto"
                />
              )}
            </div>

            {galleryItems.length > 1 && (
              <div className="border-t border-gray-200 px-4 py-3 flex gap-2 overflow-x-auto">
                {galleryItems.map((item, idx) => (
                  <button
                    key={`${item.label}-${idx}`}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border ${
                      idx === activeIndex
                        ? 'border-primary ring-2 ring-primary/40'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    title={item.label}
                  >
                    <OptimizedImage
                      src={item.thumb}
                      alt={item.label}
                      width={64}
                      quality={60}
                      className="object-cover"
                    />
                    {!item.isMain && item.variation && (
                      <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-[10px] text-white px-1 py-0.5 text-center truncate">
                        {item.variation.cor}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-5 md:p-6 flex flex-col overflow-y-auto">
            <div className="mb-4">
              <h2 className="font-title font-bold text-2xl text-text-primary mb-1">
                {product.nome}
              </h2>
              <p className="text-sm text-text-secondary">Cód: {product.id}</p>
            </div>

            {product.descricao && (
              <p className="text-sm text-gray-700 mb-4 whitespace-pre-line">
                {product.descricao}
              </p>
            )}

            {product.categorias && product.categorias.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {product.categorias.map((cat) => (
                  <span
                    key={cat}
                    className="px-2 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-700"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}

            {product.variacoes && product.variacoes.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 mb-1">
                  Cores disponíveis
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.variacoes.map((v) => {
                    const isActive = galleryItems[activeIndex]?.variation?.cor === v.cor
                    return (
                      <button
                        key={v.cor}
                        type="button"
                        onClick={() => {
                          const targetIndex = galleryItems.findIndex(
                            (g) => g.variation?.cor === v.cor
                          )
                          if (targetIndex >= 0) setActiveIndex(targetIndex)
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                          isActive
                            ? 'bg-primary text-text-primary border-primary'
                            : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {v.cor}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="mt-auto pt-4 flex gap-3">
              <button
                onClick={() => {
                  addToCart(product)
                  onClose()
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-primary hover:opacity-90 text-text-primary font-semibold py-3 px-4 rounded-lg transition-all"
              >
                <ShoppingCart size={18} />
                Adicionar ao orçamento
              </button>
              <button
                onClick={onClose}
                className="px-4 py-3 rounded-lg border border-gray-300 text-sm font-semibold text-gray-800 hover:bg-gray-50"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}