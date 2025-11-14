import { memo } from 'react'
import ProductCard from './ProductCard'
import type { Product } from '@/types/product'

interface Props {
  products: Product[]
  onView: (p: Product) => void
  onAdd: (p: Product) => void
}

export default memo(function ProductGrid({ products, onView, onAdd }: Props) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(p => (
        <ProductCard
          key={p.id}
          product={p}
          onView={() => onView(p)}
          onAdd={() => onAdd(p)}
        />
      ))}
    </div>
  )
})