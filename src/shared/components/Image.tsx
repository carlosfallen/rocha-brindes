// FILE: src/shared/components/Image.tsx
import { memo, useState } from 'react'
import { optimizeUrl } from '@/shared/utils/image'

interface Props {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  onLoad?: () => void
}

export default memo(function Image({ src, alt, width = 400, height, className = '', priority = false, onLoad }: Props) {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const url = optimizeUrl(src, { width, height, quality: priority ? 85 : 75 })

  if (error) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <span className="text-xs text-gray-400">Erro ao carregar</span>
      </div>
    )
  }

  return (
    <>
      {loading && !priority && (
        <div className={`absolute inset-0 bg-gray-100 animate-pulse ${className}`} />
      )}
      <img
        src={url}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        className={className}
        onLoad={() => {
          setLoading(false)
          onLoad?.()
        }}
        onError={() => setError(true)}
        style={{ opacity: loading && !priority ? 0 : 1, transition: 'opacity 0.3s' }}
      />
    </>
  )
})