import { useState, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  collection, query as fsQuery, orderBy, limit, startAfter,
  getDocs, deleteDoc, doc, QueryDocumentSnapshot, DocumentData
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Product } from '@/types/product'
import { Trash2, Edit, ChevronLeft, ChevronRight } from 'lucide-react'

export default function ProductList() {
  const [page, setPage] = useState(0)
  const [cursors, setCursors] = useState<QueryDocumentSnapshot<DocumentData>[]>([])
  const pageSize = 50
  const qc = useQueryClient()

  const qRef = useMemo(() => {
    const base = fsQuery(
      collection(db, 'produtos'),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    )
    // se página > 0 e temos cursor daquela página anterior, paginamos
    if (page > 0 && cursors[page - 1]) {
      return fsQuery(
        collection(db, 'produtos'),
        orderBy('createdAt', 'desc'),
        startAfter(cursors[page - 1]),
        limit(pageSize)
      )
    }
    return base
  }, [page, cursors, pageSize])

  const { data: products = [], isLoading, refetch, isFetching } = useQuery<Product[]>({
    queryKey: ['admin-products', page, pageSize, cursors[page - 1]?.id],
    queryFn: async () => {
      const snapshot = await getDocs(qRef)
      const docs = snapshot.docs
      if (docs.length > 0) {
        // guarda o cursor da página atual (último doc retornado)
        setCursors(prev => {
          const next = [...prev]
          next[page] = docs[docs.length - 1]
          return next
        })
      }
      return docs.map(d => ({ id: d.id, ...(d.data() as Omit<Product, 'id'>) }))
    },
    // substitui keepPreviousData
    placeholderData: (prev) => prev ?? [],
    staleTime: 30_000,
  })

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return
    await deleteDoc(doc(db, 'produtos', id))
    await qc.invalidateQueries({ queryKey: ['admin-products'] })
    await refetch()
  }

  if (isLoading && !products.length) {
    return <div className="text-center py-8">Carregando produtos...</div>
  }

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-title font-bold">
          Produtos Cadastrados {isFetching && <span className="text-sm text-gray-400">(atualizando…)</span>}
        </h2>
      </div>

      <div className="max-h-[600px] overflow-auto divide-y">
        {products.map((product: Product) => (
          <div key={product.id} className="flex items-center gap-4 px-4 py-2 hover:bg-gray-50">
            <img
              src={product.imagem_url || (product.imagens_urls?.[0] ?? '')}
              alt={product.nome ?? 'Produto'}
              className="w-16 h-16 object-contain rounded bg-gray-50"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{product.nome}</h3>
              <p className="text-sm text-gray-500">SKU: {product.id}</p>
              <div className="flex gap-2 mt-1 flex-wrap">
                {product.categorias?.map((cat: string) => (
                  <span key={cat} className="text-xs bg-gray-200 px-2 py-1 rounded">{cat}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="Editar">
                <Edit size={18} />
              </button>
              <button onClick={() => handleDelete(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded" title="Excluir">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200 flex justify-between items-center">
        <button
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200"
        >
          <ChevronLeft size={18} />
          Anterior
        </button>
        <span className="text-sm text-gray-600">Página {page + 1}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={products.length < pageSize}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200"
        >
          Próximo
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
