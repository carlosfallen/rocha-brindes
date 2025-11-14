// src/components/HeroBanner.tsx
import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function HeroBanner() {
  const [banners, setBanners] = useState<string[]>([])
  const [current, setCurrent] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'config', 'layout'))
        if (docSnap.exists() && docSnap.data().banners) {
          setBanners(docSnap.data().banners)
        }
      } catch (error) {
        console.error('Erro ao carregar banners:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadBanners()
  }, [])

  useEffect(() => {
    if (!banners.length) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [banners])

  if (isLoading) {
    return (
      <section className="relative w-full aspect-[21/9] max-h-[400px] rounded-2xl overflow-hidden mb-12 shadow-lg">
        <div className="absolute inset-0 animate-pulse bg-gray-100" />
      </section>
    )
  }

  if (!banners.length) return null

  return (
    <section className="relative w-full aspect-[21/9] max-h-[600px] rounded-2xl overflow-hidden mb-12 shadow-lg">
      {banners.map((banner, i) => (
        <img
          key={banner}
          src={banner}
          alt={`Banner ${i + 1}`}
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-3 rounded-full transition-all ${i === current ? 'bg-primary w-8' : 'bg-white/70 w-3'}`}
            style={{ width: i === current ? '2rem' : '0.75rem' }}
            aria-label={`Ir para banner ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}