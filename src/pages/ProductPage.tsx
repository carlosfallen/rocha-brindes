// src/pages/ProductPage.tsx
import { useParams, Link } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useQuery } from '@tanstack/react-query'
import type { Product, ProductVariation } from '@/types/product'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'

export default function ProductPage() {
  const { id } = useParams()
  const [currentImage, setCurrentImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState<string>('')

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => {
      const docSnap = await getDoc(doc(db, 'produtos', id!))
      if (!docSnap.exists()) throw new Error('Produto não encontrado')
      return { id: docSnap.id, ...docSnap.data() } as Product
    }
  })

  const handleColorSelect = (variation: ProductVariation) => {
    setSelectedColor(variation.cor)
    const varIndex = product?.imagens_urls.indexOf(variation.imagem_url)
    if (varIndex !== undefined && varIndex !== -1) {
      setCurrentImage(varIndex)
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
        <Link to="/" className="text-primary hover:underline">Voltar para o catálogo</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="flex items-center gap-2 text-text-primary hover:text-primary">
            <ArrowLeft size={20} />
            Voltar ao catálogo
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-4">
                <img
                  src={product.imagens_urls?.[currentImage] || product.imagem_url}
                  alt={product.nome}
                  className="w-full h-full object-contain"
                />
              </div>
              {product.imagens_urls && product.imagens_urls.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.imagens_urls.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 ${
                        i === currentImage ? 'border-primary' : 'border-gray-200'
                      }`}
                    >
                      <img src={url} alt={`${product.nome} ${i + 1}`} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h1 className="text-3xl font-title font-bold mb-2">{product.nome}</h1>
              <p className="text-text-secondary mb-6">Código: {product.id}</p>
              
              {product.descricao && (
                <div className="mb-6">
                  <h2 className="font-semibold text-lg mb-2">Descrição</h2>
                  <p className="text-text-secondary">{product.descricao}</p>
                </div>
              )}
              
              {product.categorias && product.categorias.length > 0 && (
                <div className="mb-6">
                  <h2 className="font-semibold text-lg mb-2">Categorias</h2>
                  <div className="flex flex-wrap gap-2">
                    {product.categorias.map((cat) => (
                      <span key={cat} className="bg-gray-100 px-4 py-2 rounded-full text-sm">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {product.variacoes && product.variacoes.length > 0 && (
                <div className="mb-6">
                  <h2 className="font-semibold text-lg mb-2">Cores disponíveis</h2>
                  <div className="flex flex-wrap gap-2">
                    {product.variacoes.map((v, i) => (
                      <button
                        key={i}
                        onClick={() => handleColorSelect(v)}
                        className={`border-2 px-4 py-2 rounded-full text-sm transition-all ${
                          selectedColor === v.cor
                            ? 'border-primary bg-primary text-white'
                            : 'border-gray-300 hover:border-primary'
                        }`}
                      >
                        {v.cor}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button className="w-full bg-primary hover:opacity-90 text-text-primary font-bold py-4 rounded-lg text-lg mt-8">
                Solicitar Orçamento
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}