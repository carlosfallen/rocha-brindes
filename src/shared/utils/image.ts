// FILE: src/shared/utils/image.ts
const CDN = 'https://images.weserv.nl'

interface Opts {
  width?: number
  height?: number
  quality?: number
}

export function optimizeUrl(url: string, { width, height, quality = 75 }: Opts = {}): string {
  if (!url || url.startsWith('blob:') || url.startsWith('data:')) return url
  
  const params = new URLSearchParams({
    url,
    output: 'webp',
    q: String(quality),
    fit: 'cover',
    il: '',
    n: '-1'
  })
  
  if (width) params.set('w', String(width))
  if (height) params.set('h', String(height))
  
  return `${CDN}/?${params}`
}

export function preloadImage(url: string, priority: 'high' | 'low' = 'high') {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'image'
  link.href = url
  link.fetchPriority = priority
  document.head.appendChild(link)
}

export function preloadCriticalImages(urls: string[]) {
  urls.slice(0, 3).forEach((url, i) => {
    if (url) preloadImage(url, i === 0 ? 'high' : 'low')
  })
}

export function getImageDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = reject
    img.src = url
  })
}