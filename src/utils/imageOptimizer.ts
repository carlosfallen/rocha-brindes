// src/utils/imageOptimizer.ts
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '@/lib/firebase'

const IMAGE_CDN = 'https://images.weserv.nl'

interface ImageOptimizeOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'jpg' | 'png'
  fit?: 'contain' | 'cover'
}

export function optimizeImageUrl(url: string, options: ImageOptimizeOptions = {}): string {
  if (!url || url.startsWith('blob:')) return url

  const {
    width,
    height,
    quality = 75,
    format = 'webp',
    fit = 'contain',
  } = options

  const params = new URLSearchParams()
  params.set('url', url)
  params.set('output', format)
  params.set('q', quality.toString())
  params.set('fit', fit)
  params.set('il', '')
  
  if (width) params.set('w', width.toString())
  if (height) params.set('h', height.toString())

  return `${IMAGE_CDN}/?${params.toString()}`
}

export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = url
  })
}

export function preloadCriticalImages(urls: string[]): Promise<void[]> {
  return Promise.all(urls.slice(0, 3).map(preloadImage))
}

export async function uploadOptimizedImage(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}
