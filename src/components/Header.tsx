// src/components/Header.tsx
import { ShoppingCart } from 'lucide-react'
import { useProductStore } from '@/store/useProductStore'
import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function Header() {
  const { cartCount, toggleCart } = useProductStore()
  const [logoUrl, setLogoUrl] = useState('/assets/images/logo-rocha-brindes.png')

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'config', 'layout'))
        if (docSnap.exists() && docSnap.data().logo) {
          setLogoUrl(docSnap.data().logo)
        }
      } catch (error) {
        console.error('Erro ao carregar logo:', error)
      }
    }
    loadLogo()
  }, [])

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={logoUrl}
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