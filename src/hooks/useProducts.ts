// src/hooks/useProducts.ts
import { useQuery } from "@tanstack/react-query"
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Product } from "@/types/product"

export function useProducts(category?: string) {
  return useQuery<Product[]>({
    queryKey: ["products", category],
    queryFn: async () => {
      let q = query(collection(db, "produtos"), orderBy("createdAt", "desc"), limit(50))

      if (category && category !== "Todos") {
        q = query(
          collection(db, "produtos"),
          where("categorias", "array-contains", category),
          orderBy("createdAt", "desc")
        )
      }

      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product))
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}
