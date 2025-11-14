import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import type { ProductVariation } from '@/types/product'

interface ProductCardProps {
  id: string
  nome: string
  imagem_url?: string        // imagem original principal
  thumb_url?: string         // thumb principal (comprimida)
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
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const [imageLoaded, setImageLoaded] = useState(false)

  // 📌 Decide qual imagem mostrar no card:
  // 1. thumb principal
  // 2. imagem principal original
  // 3. thumb da primeira variação
  // 4. imagem original da primeira variação
  const displayImage = (() => {
    if (thumb_url) return thumb_url
    if (imagem_url) return imagem_url

    const firstVar = variacoes && variacoes[0]
    if (!firstVar) return undefined

    if (firstVar.thumb_url) return firstVar.thumb_url
    if (firstVar.imagem_url) return firstVar.imagem_url

    return undefined
  })()

  return (
    <div
      ref={ref}
      className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
    >
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {inView && displayImage && (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
            )}
            <img
              src={displayImage}
              alt={nome}
              loading="lazy"
              className={`w-full h-full object-contain p-4 transition-all duration-500 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          </>
        )}

        {variacoes && variacoes.length > 0 && (
          <>
            {/* Badge com contagem certa */}
            <div className="absolute top-3 left-3">
              <span className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-text-primary shadow-md">
                {variacoes.length} {variacoes.length === 1 ? 'cor' : 'cores'}
              </span>
            </div>

            {/* Lista de cores (nome) resumida */}
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
