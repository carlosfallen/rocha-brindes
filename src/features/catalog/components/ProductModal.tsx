import { useState, useMemo, memo } from 'react'
import { X, ShoppingCart } from 'lucide-react'
import Image from '@/shared/components/Image'
import { useCart } from '@/core/store/cart'
import type { Product, ProductVariation } from '@/types/product'

interface Props {
  product: Product
  onClose: () => void
}

interface GalleryItem {
  label: string
  url: string
  variation?: ProductVariation
}

export default memo(function ProductModal({ product, onClose }: Props) {
  const { add } = useCart()

  const gallery = useMemo<GalleryItem[]>(() => {
    const items: GalleryItem[] = []

    if (product.imagem_url) {
      items.push({ label: 'Principal', url: product.imagem_url })
    }

    if (product.variacoes?.length) {
      product.variacoes.forEach(v => {
        if (v.imagem_url) {
          items.push({ label: v.cor, url: v.imagem_url, variation: v })
        }
      })
    }

    if (!items.length && product.imagens_urls?.length) {
      product.imagens_urls.forEach((url, i) => {
        items.push({ label: i === 0 ? 'Imagem' : `Imagem ${i + 1}`, url })
      })
    }

    return items
  }, [product])

  const [activeIndex, setActiveIndex] = useState(0)
  const active = gallery[activeIndex] || gallery[0]

  const handleAdd = () => {
    add(product)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-black/70 text-white rounded-full p-2 z-10 hover:bg-black transition"
        >
          <X size={18} />
        </button>

        <div className="grid md:grid-cols-[1.2fr_1fr] gap-0 md:gap-6 h-full">
          <div className="bg-gray-50 flex flex-col">
            <div className="flex-1 flex items-center justify-center p-4">
              {active && (
                <Image
                  src={active.url}
                  alt={`${product.nome} - ${active.label}`}
                  width={800}
                  priority
                  className="max-h-[340px] md:max-h-[560px] w-auto object-contain"
                />
              )}
            </div>

            {gallery.length > 1 && (
              <div className="border-t border-gray-200 px-4 py-3 flex gap-2 overflow-x-auto">
                {gallery.map((item, idx) => (
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
                    <Image src={item.url} alt={item.label} width={64} className="w-full h-full object-cover" />
                    {item.variation && (
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
              <h2 className="font-bold text-2xl text-gray-800 mb-1">{product.nome}</h2>
              <p className="text-sm text-gray-500">Cód: {product.id}</p>
            </div>

            {product.descricao && (
              <p className="text-sm text-gray-700 mb-4 whitespace-pre-line">
                {product.descricao}
              </p>
            )}

            {product.categorias?.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {product.categorias.map(cat => (
                  <span key={cat} className="px-2 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-700">
                    {cat}
                  </span>
                ))}
              </div>
            )}

{product.variacoes?.length ? (
  <div className="mb-4">
    <p className="text-xs font-semibold text-gray-500 mb-1">Cores disponíveis</p>

    <div className="flex flex-wrap gap-2">
      {product.variacoes?.map(v => {
        const isActive = gallery[activeIndex]?.variation?.cor === v.cor
        return (
          <button
            key={v.cor}
            type="button"
            onClick={() => {
              const targetIndex = gallery.findIndex(g => g.variation?.cor === v.cor)
              if (targetIndex >= 0) setActiveIndex(targetIndex)
            }}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
              isActive
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {v.cor}
          </button>
        )
      })}
    </div>
  </div>
) : null}

            <div className="mt-auto pt-4 flex gap-3">
              <button
                onClick={handleAdd}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-primary hover:opacity-90 text-white font-semibold py-3 px-4 rounded-lg transition"
              >
                <ShoppingCart size={18} />
                Adicionar ao orçamento
              </button>
              <button
                onClick={onClose}
                className="px-4 py-3 rounded-lg border border-gray-300 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})