// src/hooks/useLayoutAssets.ts
import { useQuery } from '@tanstack/react-query'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export interface LayoutAssets {
  logo?: string
  banners: string[]
  promotions: string[]
  popups: string[]
}

export function useLayoutAssets() {
  return useQuery<LayoutAssets>({
    queryKey: ['layout-assets'],
    queryFn: async () => {
      const snap = await getDoc(doc(db, 'config', 'layout'))

      if (!snap.exists()) {
        return {
          logo: '',
          banners: [],
          promotions: [],
          popups: [],
        }
      }

      const data = snap.data() as LayoutAssets

      return {
        logo: data.logo || '',
        banners: data.banners || [],
        promotions: data.promotions || [],
        popups: data.popups || [],
      }
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}
