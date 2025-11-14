// src/components/Header.tsx
import { ShoppingCart } from 'lucide-react'
import { useProductStore } from '@/store/useProductStore'
import { useLayoutConfig } from '@/hooks/useLayoutConfig'
import { optimizeImageUrl } from '@/utils/imageOptimizer'

export default function Header() {
  const { cartCount, toggleCart } = useProductStore()
  const { data: layout } = useLayoutConfig()

  const rawLogo = layout?.logo || '/assets/images/logo-rocha-brindes.png'

  const optimizedLogo = optimizeImageUrl(rawLogo, {
    width: 300,
    quality: 85,
    format: 'webp',
  })

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={optimizedLogo}
            alt="Rocha Brindes"
            width={257}
            height={64}
            className="h-12 md:h-16 w-auto"
            fetchPriority="high"
            decoding="async"
          />
        </div>

        <button
          onClick={toggleCart}
          className="relative p-3 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Abrir carrinho"
        >
          <ShoppingCart size={28} className="text-text-primary" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-text-primary font-bold text-xs min-w-[22px] h-[22px] flex items-center justify-center rounded-full border-2 border-white">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
