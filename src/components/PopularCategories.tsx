// src/components/PopularCategories.tsx
import { useEffect, useMemo, useState } from 'react'
import { onSnapshot, collection, query, where, limit } from 'firebase/firestore'
import { getDownloadURL, ref } from 'firebase/storage'
import { db, storage } from '@/lib/firebase'

interface PopularCategoriesProps {
  onSelectCategory: (category: string) => void
}

type Cat = {
  id: string
  nome: string
  popular?: boolean
  imagePath?: string
}

type Item = {
  name: string
  image: string
}

export default function PopularCategories({ onSelectCategory }: PopularCategoriesProps) {
  const [cats, setCats] = useState<Cat[]>([])
  const [urls, setUrls] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'categorias'), where('popular', '==', true), limit(4))
    const unsub = onSnapshot(q, async (snap) => {
      const data: Cat[] = snap.docs.map((d) => d.data() as Cat)
      setCats(data)
    })
    return () => unsub()
  }, [])

  useEffect(() => {
    let cancelled = false
    async function run() {
      setLoading(true)
      const out: Record<string, string> = {}
      for (const c of cats) {
        if (c.imagePath && c.imagePath.trim().length > 0) {
          try {
            const fileRef = ref(storage, `Category/${c.imagePath}`)
            const url = await getDownloadURL(fileRef)
            out[c.id] = url
          } catch {
            out[c.id] = ''
          }
        } else {
          out[c.id] = ''
        }
      }
      if (!cancelled) {
        setUrls(out)
        setLoading(false)
      }
    }
    if (cats.length) run()
    else setLoading(false)
    return () => {
      cancelled = true
    }
  }, [cats])

  const items: Item[] = useMemo(
    () =>
      cats
        .slice(0, 4)
        .map((c) => ({
          name: c.nome,
          image: urls[c.id] || '',
        }))
        .filter((i) => i.name && i.image),
    [cats, urls]
  )

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

  if (!items.length) return null

  return (
    <section className="mb-12">
      <h2 className="text-2xl md:text-3xl font-title font-bold text-text-primary mb-6">
        Categorias mais procuradas
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((cat) => (
          <button
            key={cat.name}
            onClick={() => onSelectCategory(cat.name)}
            className="group relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:scale-105"
          >
            <img
              src={cat.image}
              alt={cat.name}
              loading="lazy"
              className="w-full h-full object-cover brightness-90 group-hover:brightness-100 transition-all"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <h3 className="absolute bottom-4 left-4 right-4 text-white font-title font-bold text-xl">
              {cat.name}
            </h3>
          </button>
        ))}
      </div>
    </section>
  )
}
