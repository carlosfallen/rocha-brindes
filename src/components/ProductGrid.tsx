// src/components/ProductGrid.tsx
import ProductCard from './ProductCard'
import type { Product } from '@/types/product'

interface Props {
  products: Product[]
  onViewDetails: (p: Product) => void
  onAddToCart: (p: Product) => void
}

export default function ProductGrid({ products, onViewDetails, onAddToCart }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          onViewDetails={() => onViewDetails(p)}
          onAddToCart={() => onAddToCart(p)}
        />
      ))}
    </div>
  )
}
