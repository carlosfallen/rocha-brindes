// src/components/admin/ProductEditModal.tsx
import { useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '@/core/lib/firebase'
import { useCategories } from '@/core/hooks/useCategories'
import { optimizeUrl } from '@/shared/utils/image'
import { X, Upload } from 'lucide-react'
import type { Product, ProductVariation } from '@/types/product'

interface Props {
  product: Product
  onClose: () => void
}

export default function ProductEditModal({ product, onClose }: Props) {
  const [nome, setNome] = useState(product.nome || '')
  const [descricao, setDescricao] = useState(product.descricao || '')
  const [destaque, setDestaque] = useState(product.destaque || false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(product.categorias || [])
  const [mainImage, setMainImage] = useState<File | null>(null)
  const [mainImagePreview, setMainImagePreview] = useState(product.imagem_url || '')
  const [variations, setVariations] = useState<Array<{ cor: string; image: File | null; preview: string; existingUrl?: string }>>(
    product.variacoes?.map(v => ({ cor: v.cor, image: null, preview: v.imagem_url, existingUrl: v.imagem_url })) || []
  )
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
      setVariations([...variations, { cor: currentColor.trim(), image: null, preview: '' }])
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

  async function uploadOriginal(file: File, pathWithoutExt: string): Promise<string> {
    const ext = file.name.split('.').pop() || 'jpg'
    const storageRef = ref(storage, `${pathWithoutExt}.${ext}`)
    await uploadBytes(storageRef, file)
    return getDownloadURL(storageRef)
  }

  async function uploadFile(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return await getDownloadURL(storageRef)
}

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const timestamp = Date.now()
      let mainOriginalUrl = product.imagem_url
      let mainThumbUrl = product.thumb_url

      if (mainImage) {
        const mainBasePath = `products/${product.id}/main/${timestamp}`
        mainOriginalUrl = await uploadOriginal(mainImage, `${mainBasePath}_orig`)
        const uploadedMain = await uploadFile(mainImage, mainBasePath)
        mainThumbUrl = optimizeUrl(uploadedMain)
      }

      const variationsData: ProductVariation[] = []
      const allOriginals: string[] = [mainOriginalUrl || '']
      const allThumbs: string[] = [mainThumbUrl || '']

      for (const variation of variations) {
        if (variation.image) {
          const vTs = Date.now()
          const basePath = `products/${product.id}/variations/${variation.cor}/${vTs}`
          const originalUrl = await uploadOriginal(variation.image, `${basePath}_orig`)
          const thumbUrl = optimizeUrl(originalUrl)
          variationsData.push({ cor: variation.cor, imagem_url: originalUrl, thumb_url: thumbUrl })
          allOriginals.push(originalUrl)
          allThumbs.push(thumbUrl)
        } else if (variation.existingUrl) {
          const existing = product.variacoes?.find(v => v.cor === variation.cor)
          if (existing) {
            variationsData.push(existing)
            allOriginals.push(existing.imagem_url)
            allThumbs.push(existing.thumb_url || existing.imagem_url)
          }
        }
      }

      await updateDoc(doc(db, 'produtos', product.id), {
        nome,
        descricao,
        categorias: selectedCategories,
        destaque,
        variacoes: variationsData,
        imagem_url: mainOriginalUrl,
        thumb_url: mainThumbUrl,
        imagens_urls: allOriginals,
        thumbs_urls: allThumbs,
      })

      setMessage('Produto atualizado com sucesso!')
      setTimeout(() => onClose(), 1500)
    } catch (err) {
      console.error(err)
      setMessage(err instanceof Error ? err.message : 'Erro ao atualizar produto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-title font-bold">Editar Produto</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Nome</label>
              <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary" required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">SKU/Código</label>
              <input type="text" value={product.id} disabled className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Descrição</label>
            <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Categorias</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <label key={cat.id} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input type="checkbox" checked={selectedCategories.includes(cat.nome)} onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCategories((prev) => [...prev, cat.nome])
                    } else {
                      setSelectedCategories((prev) => prev.filter((c) => c !== cat.nome))
                    }
                  }} className="rounded" />
                  <span className="text-sm">{cat.nome}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={destaque} onChange={(e) => setDestaque(e.target.checked)} className="rounded" />
              <span className="text-sm font-semibold">Produto em destaque</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Imagem Principal</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              {mainImagePreview ? (
                <div className="relative aspect-square max-w-xs mx-auto">
                  <img src={mainImagePreview} alt="Preview" className="w-full h-full object-contain" />
                  <label className="absolute bottom-2 right-2 bg-primary text-text-primary p-2 rounded-full cursor-pointer hover:opacity-90">
                    <Upload size={16} />
                    <input type="file" accept="image/*" onChange={handleMainImageChange} className="hidden" />
                  </label>
                </div>
              ) : (
                <label className="flex flex-col items-center gap-2 cursor-pointer">
                  <Upload className="text-gray-400" size={48} />
                  <span className="text-sm text-gray-600">Clique para selecionar imagem principal</span>
                  <input type="file" accept="image/*" onChange={handleMainImageChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Variações de Cor</label>
            <div className="flex gap-2 mb-4">
              <input type="text" value={currentColor} onChange={(e) => setCurrentColor(e.target.value)} onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddVariation()
                }
              }} placeholder="Nome da cor" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary" />
              <button type="button" onClick={handleAddVariation} className="bg-primary hover:opacity-90 text-text-primary px-4 py-2 rounded-lg font-semibold">Adicionar</button>
            </div>

            <div className="space-y-3">
              {variations.map((variation, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold text-sm mb-2">{variation.cor}</p>
                    {variation.preview ? (
                      <div className="relative w-24 h-24">
                        <img src={variation.preview} alt={variation.cor} className="w-full h-full object-cover rounded" />
                        <label className="absolute bottom-0 right-0 bg-primary text-text-primary p-1 rounded cursor-pointer">
                          <Upload size={12} />
                          <input type="file" accept="image/*" onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleVariationImageChange(index, file)
                          }} className="hidden" />
                        </label>
                      </div>
                    ) : (
                      <label className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
                        <Upload size={16} />
                        <span className="text-xs">Adicionar imagem</span>
                        <input type="file" accept="image/*" onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleVariationImageChange(index, file)
                        }} className="hidden" />
                      </label>
                    )}
                  </div>
                  <button type="button" onClick={() => handleRemoveVariation(index)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {message && (
            <p className={`text-center font-semibold ${message.includes('sucesso') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>
          )}

          <button type="submit" disabled={loading} className="w-full bg-primary hover:opacity-90 text-text-primary font-bold py-3 rounded-lg transition-all disabled:opacity-50">
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </div>
    </div>
  )
}