// src/pages/Home.tsx
import { useState, useMemo, lazy, Suspense } from 'react'
import { useHomeData } from '@/hooks/useHomeData'
import { useProductStore } from '@/store/useProductStore'
import Header from '@/components/Header'
import type { Product } from '@/types/product'

const HeroBanner = lazy(() => import('@/components/HeroBanner'))
const PopularCategories = lazy(() => import('@/components/PopularCategories'))
const CategorySidebar = lazy(() => import('@/components/CategorySidebar'))
const VirtualProductGrid = lazy(() => import('@/components/VirtualProductGrid'))
const ProductModal = lazy(() => import('@/components/ProductModal'))
const CartSidebar = lazy(() => import('@/components/CartSidebar'))

export default function Home() {
  const { selectedCategory, setSelectedCategory, searchTerm, setSearchTerm, addToCart } =
    useProductStore()

  const { data, isLoading } = useHomeData()
  const products = data?.products ?? []
  const categories = data?.categories ?? []

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory =
        selectedCategory === 'Todos' || p.categorias?.includes(selectedCategory)
      const matchSearch =
        !searchTerm ||
        p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
      return matchCategory && matchSearch
    })
  }, [products, selectedCategory, searchTerm])

  const skeletonGrid = (
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
          {/* Banner lazy */}
          <Suspense
            fallback={
              <div className="mb-8 h-40 md:h-56 rounded-2xl bg-gray-100 animate-pulse" />
            }
          >
            <HeroBanner />
          </Suspense>

          {/* Categorias populares lazy, sem hits no Firestore */}
          <Suspense fallback={null}>
            <PopularCategories
              categories={categories}
              onSelectCategory={setSelectedCategory}
            />
          </Suspense>

          <div className="grid lg:grid-cols-[280px_1fr] gap-8">
            {/* Sidebar lazy */}
            <Suspense fallback={null}>
              <CategorySidebar
                categories={categories.map((c) => c.nome)}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
            </Suspense>

            <div>
              {isLoading ? (
                skeletonGrid
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-xl text-gray-500">Nenhum produto encontrado</p>
                </div>
              ) : (
                <Suspense fallback={skeletonGrid}>
                  <VirtualProductGrid
                    products={filteredProducts}
                    onViewDetails={setSelectedProduct}
                    onAddToCart={addToCart}
                  />
                </Suspense>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modal de produto lazy */}
      <Suspense fallback={null}>
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </Suspense>

      {/* Carrinho lazy */}
      <Suspense fallback={null}>
        <CartSidebar />
      </Suspense>
    </>
  )
}
