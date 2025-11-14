// FILE: src/features/catalog/CatalogPage.tsx
import { useMemo, lazy, Suspense, useState } from 'react'
import { useCatalog } from '@/core/hooks/useCatalog'
import { useCart } from '@/core/store/cart'
import Header from '@/shared/components/Header'
import type { Product } from '@/types/product'

const HeroBanner = lazy(() => import('@/shared/components/HeroBanner'))
const PopularCategories = lazy(() => import('@/shared/components/PopularCategories'))
const CategorySidebar = lazy(() => import('./components/CategorySidebar'))
const ProductGrid = lazy(() => import('./components/ProductGrid'))
const ProductModal = lazy(() => import('./components/ProductModal'))
const CartSidebar = lazy(() => import('@/features/cart/CartSidebar'))

export default function CatalogPage() {
  const { data, isLoading } = useCatalog()
  const { category, search, add, setCategory, setSearch } = useCart()
  const [selected, setSelected] = useState<Product | null>(null)

  const filtered = useMemo(() => {
    if (!data) return []
    return data.products.filter(p => {
      const matchCat = category === 'Todos' || p.categorias?.includes(category)
      const matchSearch = !search || p.nome.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })
  }, [data, category, search])

  const skeleton = (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(9)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl h-96 animate-pulse" />
      ))}
    </div>
  )

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Suspense fallback={<div className="mb-8 h-40 md:h-56 rounded-2xl bg-gray-100 animate-pulse" />}>
            <HeroBanner banners={data?.layout.banners || []} />
          </Suspense>

          <Suspense fallback={null}>
            <PopularCategories categories={data?.categories.filter(c => c.popular).slice(0, 4) || []} onSelect={setCategory} />
          </Suspense>

          <div className="grid lg:grid-cols-[280px_1fr] gap-8">
            <Suspense fallback={null}>
              <CategorySidebar
                categories={data?.categories.map(c => c.nome) || []}
                selected={category}
                onSelect={setCategory}
                search={search}
                onSearch={setSearch}
              />
            </Suspense>

            <div>
              {isLoading ? skeleton : filtered.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-xl text-gray-500">Nenhum produto encontrado</p>
                </div>
              ) : (
                <Suspense fallback={skeleton}>
                  <ProductGrid products={filtered} onView={setSelected} onAdd={add} />
                </Suspense>
              )}
            </div>
          </div>
        </div>
      </main>

      <Suspense fallback={null}>
        {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
        <CartSidebar />
      </Suspense>
    </>
  )
}