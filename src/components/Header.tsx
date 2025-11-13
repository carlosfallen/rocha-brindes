// src/components/Header.tsx  (busca logo em /Logo)
import { ShoppingCart } from 'lucide-react'
import { useProductStore } from '@/store/useProductStore'
import { useStorageFiles } from '@/hooks/useStorageFiles'
import { useMemo } from 'react'

export default function Header() {
  const { cartCount, toggleCart } = useProductStore()
  const { data: logos = [] } = useStorageFiles('Logo') // <- pasta do Storage
  const logoSrc = useMemo(() => logos[0] ?? '/assets/images/logo-rocha-brindes.png', [logos])

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={logoSrc}
            alt="Rocha Brindes"
            className="h-12 md:h-16 w-auto"
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
