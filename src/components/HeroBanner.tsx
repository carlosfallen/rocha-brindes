// src/components/HeroBanner.tsx
import OptimizedImage from './OptimizedImage'
import { useLayoutConfig } from '@/hooks/useLayoutConfig'

export default function HeroBanner() {
  const { data: layout, isLoading } = useLayoutConfig()
  const banner = layout?.banners?.[0]

  if (isLoading) {
    return (
      <section className="mb-8 h-40 md:h-56 rounded-2xl bg-gray-100 animate-pulse" />
    )
  }

  if (!banner) return null

  return (
    <section className="mb-8">
      <div className="relative h-40 md:h-56 rounded-2xl overflow-hidden bg-gray-100">
        <OptimizedImage
          src={banner.url}
          alt={banner.alt || 'Banner Rocha Brindes'}
          width={1248}
          height={390}
          priority
          sizes="100vw"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </section>
  )
}
