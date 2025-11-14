// FILE: src/features/catalog/components/ProductCard.tsx
import { memo } from 'react'
import { ShoppingCart } from 'lucide-react'
import Image from '@/shared/components/Image'
import type { Product } from '@/types/product'

interface Props {
  product: Product
  onView: () => void
  onAdd: () => void
}

export default memo(function ProductCard({ product, onView, onAdd }: Props) {
  const img = product.thumb_url || product.imagem_url || product.variacoes?.[0]?.thumb_url || product.variacoes?.[0]?.imagem_url
  
  return (
    <article className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {img ? (
          <Image 
            src={img} 
            alt={`Produto ${product.nome}`} 
            width={400} 
            height={400}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-sm">Sem imagem</span>
          </div>
        )}
        
        {product.variacoes && product.variacoes.length > 0 && (
          <div className="absolute top-2 left-2">
            <span className="bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-semibold text-gray-700 shadow">
              {product.variacoes.length} {product.variacoes.length === 1 ? 'cor' : 'cores'}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 line-clamp-2 min-h-[56px] text-gray-800">
          {product.nome}
        </h3>
        <p className="text-sm text-gray-500 mb-3">Código: {product.id}</p>

        <div className="flex gap-2">
          <button 
            onClick={onView} 
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-3 rounded-lg text-sm transition"
            aria-label={`Ver detalhes de ${product.nome}`}
          >
            Detalhes
          </button>
          <button 
            onClick={onAdd} 
            className="bg-primary hover:opacity-90 text-white p-2 rounded-lg transition" 
            aria-label={`Adicionar ${product.nome} ao orçamento`}
          >
            <ShoppingCart size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  )
})