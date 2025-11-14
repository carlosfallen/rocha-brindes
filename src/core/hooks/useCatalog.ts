// FILE: src/core/hooks/useCatalog.ts
import { useQuery } from '@tanstack/react-query'
import { collection, getDocs, query, orderBy, limit, doc, getDoc } from 'firebase/firestore'
import { db } from '@/core/lib/firebase'
import type { Product, Category } from '@/types/product'

interface LayoutConfig {
  logo?: string
  banners: Array<{ url: string; alt?: string }>
  promotions: string[]
  popups: string[]
}

interface CatalogData {
  products: Product[]
  categories: Category[]
  layout: LayoutConfig
}

export function useCatalog(productLimit = 100) {
  return useQuery<CatalogData>({
    queryKey: ['catalog', productLimit],
    queryFn: async () => {
      const [productsSnap, categoriesSnap, layoutDoc] = await Promise.all([
        getDocs(query(collection(db, 'produtos'), orderBy('createdAt', 'desc'), limit(productLimit))),
        getDocs(query(collection(db, 'categorias'), orderBy('nome'))),
        getDoc(doc(db, 'config', 'layout'))
      ])

      const products = productsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Product[]
      const categories = categoriesSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Category[]
      
      const layoutData = layoutDoc.exists() ? layoutDoc.data() : {}
      const layout: LayoutConfig = {
        logo: layoutData.logo || '',
        banners: (layoutData.banners || []).map((url: string) => ({ url, alt: 'Banner Rocha Brindes' })),
        promotions: layoutData.promotions || [],
        popups: layoutData.popups || []
      }

      return { products, categories, layout }
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    placeholderData: getCachedCatalog()
  })
}

function getCachedCatalog(): CatalogData | undefined {
  try {
    const cached = localStorage.getItem('catalog-cache')
    if (cached) {
      const data = JSON.parse(cached)
      const age = Date.now() - data.timestamp
      if (age < 10 * 60 * 1000) {
        return data.catalog
      }
    }
  } catch (e) {
    return undefined
  }
}

export function setCachedCatalog(data: CatalogData) {
  try {
    localStorage.setItem('catalog-cache', JSON.stringify({
      catalog: data,
      timestamp: Date.now()
    }))
  } catch (e) {
    console.warn('Failed to cache catalog')
  }
}