// src/components/admin/ProductForm.tsx
import { useState } from 'react'
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '@/lib/firebase'
import { useCategories } from '@/hooks/useCategories'
import ImageSelector from './ImageSelector'

export default function ProductForm() {
  const [nome, setNome] = useState('')
  const [sku, setSku] = useState('')
  const [descricao, setDescricao] = useState('')
  const [destaque, setDestaque] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [variacoes, setVariacoes] = useState<string[]>([])
  const [currentVariacao, setCurrentVariacao] = useState('')

  // imagens
  const [uploadFiles, setUploadFiles] = useState<File[]>([])
  const [chosenUrls, setChosenUrls] = useState<string[]>([])
  const [subfolder, setSubfolder] = useState('') // sincronizado manualmente (ver abaixo)

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const { data: categories = [] } = useCategories()

  const handleAddVariacao = () => {
    if (currentVariacao.trim()) {
      setVariacoes((v) => [...v, currentVariacao.trim()])
      setCurrentVariacao('')
    }
  }

  const handleRemoveVariacao = (index: number) => {
    setVariacoes((all) => all.filter((_, i) => i !== index))
  }

  async function doUploads(): Promise<string[]> {
    const urls: string[] = []
    for (const file of uploadFiles) {
      const base = 'produtos' // pasta base
      const folder = subfolder ? `${base}/${subfolder.replace(/^\/|\/$/g, '')}` : base
      const path = `${folder}/${Date.now()}_${file.name}`
      const storageRef = ref(storage, path)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)
      urls.push(url)
    }
    return urls
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      // Recupera subpasta do input hidden gerado no ImageSelector
      const form = e.currentTarget
      const hidden = form.querySelector<HTMLInputElement>('input[name="__image_subfolder"]')
      setSubfolder(hidden?.value || '')

      const uploaded = await doUploads()
      const imageUrls = [...chosenUrls, ...uploaded]
      if (imageUrls.length === 0) throw new Error('Selecione ou envie ao menos uma imagem')

      await setDoc(doc(collection(db, 'produtos'), sku), {
        id: sku,
        nome,
        descricao,
        categorias: selectedCategories,
        destaque,
        variacoes,
        imagens_urls: imageUrls,
        imagem_url: imageUrls[0],
        createdAt: serverTimestamp(),
      })

      setMessage('Produto salvo com sucesso!')
      setNome('')
      setSku('')
      setDescricao('')
      setDestaque(false)
      setSelectedCategories([])
      setVariacoes([])
      setUploadFiles([])
      setChosenUrls([])
      setSubfolder('')
    } catch (err) {
      console.error(err)
      setMessage('Erro ao salvar produto')
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
            <label className="block text-sm font-semibold mb-2">SKU</label>
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
                      setSelectedCategories((prev) => prev.filter((c) => c !== cat.nome))
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
          <label className="block text-sm font-semibold mb-2">Variações (cores)</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={currentVariacao}
              onChange={(e) => setCurrentVariacao(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddVariacao()
                }
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              placeholder="Digite e pressione Enter"
            />
            <button
              type="button"
              onClick={handleAddVariacao}
              className="bg-primary hover:opacity-90 text-text-primary px-4 py-2 rounded-lg font-semibold"
            >
              Adicionar
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {variacoes.map((v, i) => (
              <span key={i} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {v}
                <button
                  type="button"
                  onClick={() => handleRemoveVariacao(i)}
                  className="text-red-500 hover:text-red-700 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* >>> Imagens: upload OU escolher do Storage <<< */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold">Imagens</label>
          <ImageSelector
            prefix="produtos"
            uploadBasePath="produtos"
            multiple
            onFilesChange={setUploadFiles}
            onUrlsChange={setChosenUrls}
          />
        </div>

        {message && (
          <p
            className={`text-center font-semibold ${
              message.includes('sucesso') ? 'text-green-600' : 'text-red-600'
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
