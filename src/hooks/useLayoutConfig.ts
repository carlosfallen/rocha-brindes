// src/hooks/useLayoutConfig.ts
import { useQuery } from '@tanstack/react-query'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export interface LayoutConfig {
  logo?: string
  banners: string[]
  promotions: string[]
  popups: string[]
}

export function useLayoutConfig() {
  return useQuery<LayoutConfig>({
    queryKey: ['layout-config'],
    queryFn: async () => {
      const snap = await getDoc(doc(db, 'config', 'layout'))

      if (!snap.exists()) {
        return { logo: undefined, banners: [], promotions: [], popups: [] }
      }

      const data = snap.data() as any

      return {
        logo: data.logo || undefined,
        banners: data.banners || [],
        promotions: data.promotions || [],
        popups: data.popups || [],
      }
    },
    staleTime: 1000 * 60 * 60,  // 1h "fresco"
    gcTime: 1000 * 60 * 60 * 6, // 6h no cache
  })
}
