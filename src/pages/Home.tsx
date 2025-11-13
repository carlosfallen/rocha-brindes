// src/pages/Home.tsx (atualizado)
import { useState, useMemo } from 'react'
import { useProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { useProductStore } from '@/store/useProductStore'
import Header from '@/components/Header'
import HeroBanner from '@/components/HeroBanner'
import PopularCategories from '@/components/PopularCategories'
import CategorySidebar from '@/components/CategorySidebar'
import ProductCard from '@/components/ProductCard'
import ProductModal from '@/components/ProductModal'
import CartSidebar from '@/components/CartSidebar'
import type { Product } from '@/types/product'

export default function Home() {
  const { selectedCategory, setSelectedCategory, searchTerm, setSearchTerm, addToCart } = useProductStore()
  const { data: products = [], isLoading } = useProducts()
  const { data: categories = [] } = useCategories()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCategory = selectedCategory === 'Todos' || p.categorias?.includes(selectedCategory)
      const matchSearch = !searchTerm || 
        p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
      return matchCategory && matchSearch
    })
  }, [products, selectedCategory, searchTerm])

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <HeroBanner />
          <PopularCategories onSelectCategory={setSelectedCategory} />

          <div className="grid lg:grid-cols-[280px_1fr] gap-8">
            <CategorySidebar
              categories={categories.map(c => c.nome)}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />

            <div>
              {isLoading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl h-96 animate-pulse" />
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-xl text-gray-500">Nenhum produto encontrado</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      {...product}
                      onViewDetails={() => setSelectedProduct(product)}
                      onAddToCart={() => addToCart(product)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
      
      <CartSidebar />
    </>
  )
}