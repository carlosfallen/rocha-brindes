// src/components/ProductCard.tsx
import { ShoppingCart } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import OptimizedImage from './OptimizedImage'
import type { ProductVariation } from '@/types/product'

interface ProductCardProps {
  id: string
  nome: string
  imagem_url?: string
  thumb_url?: string
  variacoes?: ProductVariation[]
  onViewDetails: () => void
  onAddToCart: () => void
}

export default function ProductCard({
  id,
  nome,
  imagem_url,
  thumb_url,
  variacoes,
  onViewDetails,
  onAddToCart,
}: ProductCardProps) {
  const { ref, inView } = useInView({ 
    triggerOnce: true, 
    threshold: 0.01, 
    rootMargin: '200px' 
  })

  const displayImage = thumb_url || imagem_url || variacoes?.[0]?.thumb_url || variacoes?.[0]?.imagem_url

  return (
    <div
      ref={ref}
      className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 will-change-transform"
    >
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {inView && displayImage && (
          <OptimizedImage
            src={displayImage}
            alt={nome}
            width={400}
            quality={75}
            className="group-hover:scale-110 transition-transform duration-500"
          />
        )}

        {variacoes && variacoes.length > 0 && (
          <>
            <div className="absolute top-3 left-3">
              <span className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-text-primary shadow-md">
                {variacoes.length} {variacoes.length === 1 ? 'cor' : 'cores'}
              </span>
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1">
              {variacoes.slice(0, 3).map((v) => (
                <span
                  key={v.cor}
                  className="bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-semibold text-text-primary shadow"
                >
                  {v.cor}
                </span>
              ))}
              {variacoes.length > 3 && (
                <span className="bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-semibold text-text-primary shadow">
                  +{variacoes.length - 3}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-title font-bold text-lg text-text-primary mb-2 line-clamp-2 min-h-[56px]">
          {nome}
        </h3>
        <p className="text-sm text-text-secondary mb-4">Cód: {id}</p>

        <div className="flex gap-2">
          <button
            onClick={onViewDetails}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-text-primary font-semibold py-3 px-4 rounded-lg transition-all"
          >
            Ver Detalhes
          </button>
          <button
            onClick={onAddToCart}
            className="bg-primary hover:opacity-90 text-text-primary font-semibold p-3 rounded-lg transition-all"
            aria-label="Adicionar ao orçamento"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}