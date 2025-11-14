import ProductCard from './ProductCard'
import type { Product } from '@/types/product'

interface ProductGridProps {
  products: Product[]
  onViewDetails: (product: Product) => void
  onAddToCart: (product: Product) => void
}

export default function ProductGrid({
  products,
  onViewDetails,
  onAddToCart,
}: ProductGridProps) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onViewDetails={() => onViewDetails(product)}
          onAddToCart={() => onAddToCart(product)}
        />
      ))}
    </div>
  )
}
