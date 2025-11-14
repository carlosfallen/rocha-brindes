// src/hooks/useHomeData.ts
import { useQuery } from '@tanstack/react-query'
import {
  collection,
  getDocs,
  orderBy,
  query,
  limit,
  type QueryConstraint,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Product, Category } from '@/types/product'

export interface HomeData {
  products: Product[]
  categories: Category[]
}

export function useHomeData(limitCount?: number) {
  return useQuery<HomeData>({
    queryKey: ['home-data', limitCount],
    queryFn: async () => {
      const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')]

      if (limitCount) {
        constraints.push(limit(limitCount))
      }

      const productsQuery = query(collection(db, 'produtos'), ...constraints)
      const categoriesQuery = query(collection(db, 'categorias'), orderBy('nome'))

      const [productsSnap, categoriesSnap] = await Promise.all([
        getDocs(productsQuery),
        getDocs(categoriesQuery),
      ])

      const products = productsSnap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Product[]

      const categories = categoriesSnap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Category[]

      return { products, categories }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}
