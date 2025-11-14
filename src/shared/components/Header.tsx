// FILE: src/shared/components/Header.tsx
import { useEffect } from 'react'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/core/store/cart'
import { useCatalog } from '@/core/hooks/useCatalog'
import { optimizeUrl, preloadImage } from '@/shared/utils/image'

export default function Header() {
  const { count, toggle } = useCart()
  const { data } = useCatalog()
  
  const logo = data?.layout.logo || '/assets/images/logo-rocha-brindes.png'
  const logoUrl = optimizeUrl(logo, { width: 257, height: 64, quality: 90 })

  useEffect(() => {
    if (logoUrl) preloadImage(logoUrl, 'high')
  }, [logoUrl])

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <img 
          src={logoUrl} 
          alt="Rocha Brindes - Catálogo de produtos personalizados" 
          width={257} 
          height={64} 
          className="h-12 md:h-16 w-auto" 
          fetchPriority="high" 
          decoding="async" 
        />
        
        <button 
          onClick={toggle} 
          className="relative p-3 hover:bg-gray-100 rounded-full transition-colors" 
          aria-label="Abrir carrinho de orçamento"
        >
          <ShoppingCart size={28} className="text-gray-700" />
          {count > 0 && (
            <span 
              className="absolute -top-1 -right-1 bg-primary text-white font-bold text-xs min-w-[22px] h-[22px] flex items-center justify-center rounded-full border-2 border-white"
              aria-label={`${count} ${count === 1 ? 'item' : 'itens'} no carrinho`}
            >
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}