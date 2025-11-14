// FILE: src/shared/components/HeroBanner.tsx
import { useState, useEffect } from 'react'
import Image from './Image'

interface Banner {
  url: string
  alt?: string
}

interface Props {
  banners: Banner[]
}

export default function HeroBanner({ banners }: Props) {
  const [current, setCurrent] = useState(0)
  const [loaded, setLoaded] = useState(false)
  
  useEffect(() => {
    if (banners.length <= 1) return
    const timer = setInterval(() => setCurrent(i => (i + 1) % banners.length), 5000)
    return () => clearInterval(timer)
  }, [banners.length])

  if (!banners.length) return null

  return (
    <section className="mb-8 relative h-40 md:h-56 rounded-2xl overflow-hidden bg-gray-100" aria-label="Banners promocionais">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-gray-300 border-t-primary rounded-full animate-spin" />
        </div>
      )}
      
      {banners.map((banner, i) => (
        <div 
          key={banner.url} 
          className={`absolute inset-0 transition-opacity duration-500 ${i === current ? 'opacity-100' : 'opacity-0'} ${!loaded ? 'invisible' : ''}`}
          aria-hidden={i !== current}
        >
          <Image 
            src={banner.url} 
            alt={banner.alt || `Promoção ${i + 1}`} 
            width={1248} 
            height={390} 
            priority={i === 0} 
            className="w-full h-full object-cover"
            onLoad={() => i === 0 && setLoaded(true)}
          />
        </div>
      ))}
      
      {loaded && banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2" role="tablist" aria-label="Navegação de banners">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === current ? 'bg-white w-6' : 'bg-white/50'
              }`}
              aria-label={`Ir para banner ${i + 1}`}
              aria-selected={i === current}
              role="tab"
            />
          ))}
        </div>
      )}
    </section>
  )
}