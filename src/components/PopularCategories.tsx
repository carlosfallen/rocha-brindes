// src/components/PopularCategories.tsx
import { useEffect, useState } from 'react'
import { collection, query, where, limit, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface PopularCategoriesProps {
  onSelectCategory: (category: string) => void
}

type Cat = {
  id: string
  nome: string
  popular?: boolean
  imagePath?: string
}

export default function PopularCategories({ onSelectCategory }: PopularCategoriesProps) {
  const [categories, setCategories] = useState<Cat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const q = query(
          collection(db, 'categorias'),
          where('popular', '==', true),
          limit(4)
        )
        const snapshot = await getDocs(q)
        const data = snapshot.docs.map(doc => doc.data() as Cat)
        setCategories(data.filter(c => c.imagePath))
      } catch (error) {
        console.error('Erro ao carregar categorias populares:', error)
      } finally {
        setLoading(false)
      }
    }
    loadCategories()
  }, [])

  if (loading) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-title font-bold text-text-primary mb-6">
          Categorias mais procuradas
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  if (!categories.length) return null

  return (
    <section className="mb-12">
      <h2 className="text-2xl md:text-3xl font-title font-bold text-text-primary mb-6">
        Categorias mais procuradas
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.nome)}
            className="group relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:scale-105"
          >
            <img
              src={cat.imagePath}
              alt={cat.nome}
              loading="lazy"
              className="w-full h-full object-cover brightness-90 group-hover:brightness-100 transition-all"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <h3 className="absolute bottom-4 left-4 right-4 text-white font-title font-bold text-xl">
              {cat.nome}
            </h3>
          </button>
        ))}
      </div>
    </section>
  )
}