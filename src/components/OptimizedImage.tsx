// src/components/OptimizedImage.tsx
import { useState, useEffect, useRef } from 'react'
import { optimizeImageUrl } from '@/utils/imageOptimizer'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  quality?: number
  className?: string
  priority?: boolean
  sizes?: string
  onLoad?: () => void
}

export default function OptimizedImage({
  src,
  alt,
  width = 640,
  height,
  quality = 75,
  className = '',
  priority = false,
  sizes = '100vw',
  onLoad,
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  // Quando a imagem é pequena (thumbs, ícones etc) não vale a pena carregar blur + final
  const useBlurPlaceholder = width > 120 && !priority

  const webpUrl = optimizeImageUrl(src, { width, height, quality, format: 'webp' })
  const jpgUrl = optimizeImageUrl(src, { width, height, quality, format: 'jpg' })
  const thumbUrl = useBlurPlaceholder
    ? optimizeImageUrl(src, { width: 20, height, quality: 20, format: 'webp' })
    : ''

  useEffect(() => {
    if (priority && imgRef.current) {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = webpUrl
      document.head.appendChild(link)
      return () => {
        document.head.removeChild(link)
      }
    }
  }, [priority, webpUrl])

  const handleLoad = () => {
    setLoaded(true)
    onLoad?.()
  }

  if (error) {
    return (
      <div className={`bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-400 text-xs">Erro ao carregar</span>
      </div>
    )
  }

  return (
    <div className={`absolute inset-0 ${className}`}>
      {useBlurPlaceholder && (
        <img
          src={thumbUrl}
          alt=""
          width={width}
          height={height}
          className={`absolute inset-0 w-full h-full object-cover blur-xl scale-110 transition-opacity duration-500 ${
            loaded ? 'opacity-0' : 'opacity-100'
          }`}
          aria-hidden="true"
        />
      )}

      <picture>
        <source srcSet={webpUrl} type="image/webp" />
        <source srcSet={jpgUrl} type="image/jpeg" />
        <img
          ref={imgRef}
          src={jpgUrl}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          sizes={sizes}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={() => setError(true)}
        />
      </picture>
    </div>
  )
}
