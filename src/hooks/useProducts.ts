// src/hooks/useProducts.ts
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
import type { Product } from '@/types/product'

export function useProducts(limitCount?: number) {
  return useQuery<Product[]>({
    queryKey: ['products', limitCount],
    queryFn: async () => {
      const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')]

      if (limitCount) {
        constraints.push(limit(limitCount))
      }

      const q = query(collection(db, 'produtos'), ...constraints)
      const snapshot = await getDocs(q)

      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Product[]
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}
