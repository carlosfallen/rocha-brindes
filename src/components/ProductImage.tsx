// src/components/ProductImage.tsx
import { useState } from 'react'

interface ProductImageProps {
  src: string
  alt: string
}

export default function ProductImage({ src, alt }: ProductImageProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      {!loaded && <div className="w-full h-full bg-gray-100 animate-pulse" />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`w-full h-full object-contain transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
      />
    </>
  )
}