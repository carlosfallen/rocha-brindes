// src/components/VirtualProductGrid.tsx
import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'
import { useWindowSize } from '@/hooks/useWindowSize'
import ProductCard from './ProductCard'
import type { Product } from '@/types/product'

interface Props {
  products: Product[]
  onViewDetails: (p: Product) => void
  onAddToCart: (p: Product) => void   // ⟵ ADICIONE ESTA LINHA
}

export default function VirtualProductGrid({ products, onViewDetails, onAddToCart }: Props) {
  const parentRef = useRef<HTMLDivElement>(null)
  const { width, height } = useWindowSize()

  const columnCount =
    width >= 1024 ? 4 :
    width >= 768  ? 3 :
    width >= 640  ? 2 : 1

  const rowCount = Math.ceil(products.length / columnCount)

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 420,
    overscan: 3,
  })

  const viewportH = Math.min(800, Math.max(400, height - 200))

  return (
    <div ref={parentRef} className="overflow-auto" style={{ height: viewportH, width }}>
      <div style={{ height: rowVirtualizer.getTotalSize(), width: '100%', position: 'relative' }}>
        {rowVirtualizer.getVirtualItems().map((vi) => {
          const start = vi.index * columnCount
          const slice = products.slice(start, start + columnCount)
          return (
            <div
              key={vi.key}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', transform: `translateY(${vi.start}px)` }}
            >
              {slice.map((p) => (
                <div key={p.id} className="p-2">
                  <ProductCard 
                    id={p.id}
                    nome={p.nome}
                    imagem_url={p.imagem_url || ''}  // garante string
                    variacoes={p.variacoes}
                    onViewDetails={() => onViewDetails(p)}
                    onAddToCart={() => onAddToCart(p)} 
                  />
                </div>
              ))}
              {slice.length < columnCount &&
                Array.from({ length: columnCount - slice.length }).map((_, i) => (
                  <div key={`pad-${vi.key}-${i}`} className="p-2" />
                ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
