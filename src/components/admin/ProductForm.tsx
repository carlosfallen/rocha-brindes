// src/components/admin/ProductForm.tsx
import { useState } from 'react'
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '@/lib/firebase'
import { useCategories } from '@/hooks/useCategories'
import { uploadOptimizedImage } from '@/utils/imageOptimizer'
import { X, Upload } from 'lucide-react'
import type { ProductVariation } from '@/types/product'

export default function ProductForm() {
  const [nome, setNome] = useState('')
  const [sku, setSku] = useState('')
  const [descricao, setDescricao] = useState('')
  const [destaque, setDestaque] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const [mainImage, setMainImage] = useState<File | null>(null)
  const [mainImagePreview, setMainImagePreview] = useState<string>('')

  const [variations, setVariations] = useState<
    Array<{ cor: string; image: File | null; preview: string }>
  >([])
  const [currentColor, setCurrentColor] = useState('')

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const { data: categories = [] } = useCategories()

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setMainImage(file)
      setMainImagePreview(URL.createObjectURL(file))
    }
  }

  const handleAddVariation = () => {
    if (currentColor.trim()) {
      setVariations([
        ...variations,
        { cor: currentColor.trim(), image: null, preview: '' },
      ])
      setCurrentColor('')
    }
  }

  const handleVariationImageChange = (index: number, file: File) => {
    const newVariations = [...variations]
    newVariations[index].image = file
    newVariations[index].preview = URL.createObjectURL(file)
    setVariations(newVariations)
  }

  const handleRemoveVariation = (index: number) => {
    setVariations(variations.filter((_, i) => i !== index))
  }

  async function uploadOriginal(
    file: File,
    pathWithoutExt: string
  ): Promise<string> {
    const ext = file.name.split('.').pop() || 'jpg'
    const storageRef = ref(storage, `${pathWithoutExt}.${ext}`)
    await uploadBytes(storageRef, file)
    return getDownloadURL(storageRef)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (!mainImage) throw new Error('Selecione a imagem principal')
      if (!sku.trim()) throw new Error('Informe um código/SKU')

      const timestamp = Date.now()

      // 👉 Principal: original + thumb
      const mainBasePath = `products/${sku}/main/${timestamp}`

      const mainOriginalUrl = await uploadOriginal(
        mainImage,
        `${mainBasePath}_orig`
      )

      const mainThumbUrl = await uploadOptimizedImage(
        mainImage,
        `${mainBasePath}_thumb.webp`
      )

      const variationsData: ProductVariation[] = []
      const allOriginals: string[] = [mainOriginalUrl]
      const allThumbs: string[] = [mainThumbUrl]

      for (const variation of variations) {
        if (!variation.image) continue

        const vTs = Date.now()
        const basePath = `products/${sku}/variations/${variation.cor}/${vTs}`

        const originalUrl = await uploadOriginal(
          variation.image,
          `${basePath}_orig`
        )

        const thumbUrl = await uploadOptimizedImage(
          variation.image,
          `${basePath}_thumb.webp`
        )

        variationsData.push({
          cor: variation.cor,
          imagem_url: originalUrl,
          thumb_url: thumbUrl,
        })

        allOriginals.push(originalUrl)
        allThumbs.push(thumbUrl)
      }

      await setDoc(doc(collection(db, 'produtos'), sku), {
        id: sku,
        nome,
        descricao,
        categorias: selectedCategories,
        destaque,
        variacoes: variationsData,

        // imagem principal (detalhe)
        imagem_url: mainOriginalUrl,
        thumb_url: mainThumbUrl,

        // galerias
        imagens_urls: allOriginals,
        thumbs_urls: allThumbs,

        createdAt: serverTimestamp(),
      })

      setMessage('Produto salvo com sucesso!')
      setNome('')
      setSku('')
      setDescricao('')
      setDestaque(false)
      setSelectedCategories([])
      setMainImage(null)
      setMainImagePreview('')
      setVariations([])
    } catch (err) {
      console.error(err)
      setMessage(
        err instanceof Error ? err.message : 'Erro ao salvar produto'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-title font-bold mb-6">Adicionar Produto</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">
              SKU/Código
            </label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Descrição</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Categorias</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <label
                key={cat.id}
                className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.nome)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCategories((prev) => [...prev, cat.nome])
                    } else {
                      setSelectedCategories((prev) =>
                        prev.filter((c) => c !== cat.nome)
                      )
                    }
                  }}
                  className="rounded"
                />
                <span className="text-sm">{cat.nome}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={destaque}
              onChange={(e) => setDestaque(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm font-semibold">Produto em destaque</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Imagem Principal *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            {mainImagePreview ? (
              <div className="relative aspect-square max-w-xs mx-auto">
                <img
                  src={mainImagePreview}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => {
                    setMainImage(null)
                    setMainImagePreview('')
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center gap-2 cursor-pointer">
                <Upload className="text-gray-400" size={48} />
                <span className="text-sm text-gray-600">
                  Clique para selecionar imagem principal
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageChange}
                  className="hidden"
                  required
                />
              </label>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Variações de Cor
          </label>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={currentColor}
              onChange={(e) => setCurrentColor(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddVariation()
                }
              }}
              placeholder="Nome da cor (ex: Vermelho, Preto fosco)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={handleAddVariation}
              className="bg-primary hover:opacity-90 text-text-primary px-4 py-2 rounded-lg font-semibold"
            >
              Adicionar
            </button>
          </div>

          <div className="space-y-3">
            {variations.map((variation, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-semibold text-sm mb-2">
                    {variation.cor}
                  </p>
                  {variation.preview ? (
                    <div className="relative w-24 h-24">
                      <img
                        src={variation.preview}
                        alt={variation.cor}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  ) : (
                    <label className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
                      <Upload size={16} />
                      <span className="text-xs">Adicionar imagem</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file)
                            handleVariationImageChange(index, file)
                        }}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveVariation(index)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {message && (
          <p
            className={`text-center font-semibold ${
              message.includes('sucesso')
                ? 'text-green-600'
                : 'text-red-600'
            }`}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:opacity-90 text-text-primary font-bold py-3 rounded-lg transition-all disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Salvar Produto'}
        </button>
      </form>
    </div>
  )
}
