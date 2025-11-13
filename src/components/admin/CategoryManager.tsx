// src/components/admin/CategoryManager.tsx
import { useState } from 'react'
import { doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes } from 'firebase/storage'
import { db, storage } from '@/lib/firebase'
import { useCategories } from '@/hooks/useCategories'
import { Trash2, Upload } from 'lucide-react'
import StorageImagePicker from './StorageImagePicker'

type Cat = {
  id: string
  nome: string
  productCount?: number
  popular?: boolean
  imagePath?: string
}

export default function CategoryManager() {
  const [nome, setNome] = useState('')
  const [popular, setPopular] = useState(false)
  const [imagePath, setImagePath] = useState('') // apenas o nome do arquivo em Category/
  const [loading, setLoading] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const { data: categories = [], refetch } = useCategories()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const id = nome.toLowerCase().replace(/\s+/g, '-')
      await setDoc(doc(db, 'categorias', id), {
        id,
        nome,
        productCount: 0,
        popular,
        imagePath: imagePath?.trim() || '',
      })
      setNome('')
      setPopular(false)
      setImagePath('')
      refetch()
    } catch (error) {
      console.error(error)
      alert('Erro ao criar categoria')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza? Esta ação não pode ser desfeita.')) return
    try {
      await deleteDoc(doc(db, 'categorias', id))
      refetch()
    } catch (error) {
      console.error(error)
      alert('Erro ao excluir categoria')
    }
  }

  const togglePopular = async (cat: Cat) => {
    try {
      await updateDoc(doc(db, 'categorias', cat.id), { popular: !cat.popular })
      refetch()
    } catch (e) {
      console.error(e)
      alert('Não foi possível atualizar popular')
    }
  }

  const saveImagePath = async (cat: Cat, path: string) => {
    try {
      await updateDoc(doc(db, 'categorias', cat.id), { imagePath: path })
      refetch()
    } catch (e) {
      console.error(e)
      alert('Não foi possível salvar a imagem')
    }
  }

  async function handleUploadSingle(file: File, desiredName?: string) {
    setUploading(true)
    try {
      const safeName = (desiredName || file.name).replace(/^\/+|\/+$/g, '')
      const storageRef = ref(storage, `Category/${safeName}`)
      await uploadBytes(storageRef, file)
      setImagePath(safeName) // salva somente o nome do arquivo
      alert('Imagem enviada! Use o nome salvo no campo ao lado.')
    } catch (e) {
      console.error(e)
      alert('Falha ao enviar imagem')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-title font-bold mb-6">Gerenciar Categorias</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-6">
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome da categoria"
          className="md:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
          required
        />

        {/* escolher do Storage */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={imagePath}
            onChange={(e) => setImagePath(e.target.value)}
            placeholder="Arquivo em Category/ (ex.: bones.jpg)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
          />
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="px-3 py-2 rounded border"
          >
            Escolher
          </button>
        </div>

        {/* upload direto para Category/ */}
        <label className="flex items-center gap-2 md:col-span-2 border rounded-lg px-3 py-2 cursor-pointer">
          <Upload size={16} />
          <span className="text-sm">Enviar imagem p/ Category/</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                const desired = prompt('Nome do arquivo em Category/ (opcional)\nEx.: bones.jpg')
                handleUploadSingle(file, desired || undefined)
              }
              e.currentTarget.value = ''
            }}
          />
        </label>

        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={popular}
            onChange={(e) => setPopular(e.target.checked)}
            className="w-4 h-4"
          />
          <span>Popular</span>
        </label>

        <button
          type="submit"
          disabled={loading || uploading}
          className="bg-primary hover:opacity-90 text-text-primary font-semibold px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? 'Criando...' : uploading ? 'Enviando...' : 'Criar'}
        </button>
      </form>

      <div className="space-y-2">
        {categories.map((cat: Cat) => (
          <div key={cat.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <h3 className="font-semibold">{cat.nome}</h3>
              <p className="text-sm text-gray-500">{cat.productCount || 0} produtos</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => togglePopular(cat)}
                  className={`px-3 py-1 rounded border ${
                    cat.popular ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300'
                  }`}
                >
                  {cat.popular ? 'Popular ✓' : 'Marcar como popular'}
                </button>
                <div className="flex items-center gap-2">
                  <input
                    defaultValue={cat.imagePath || ''}
                    onBlur={(e) => saveImagePath(cat, e.target.value.trim())}
                    placeholder="Category/arquivo (ex.: bones.jpg)"
                    className="px-3 py-1 border border-gray-300 rounded"
                  />
                  <span className="text-xs text-gray-500">salva ao sair</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleDelete(cat.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <StorageImagePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        prefix="Category"
        onSelect={(fileName) => setImagePath(fileName)}
      />
    </div>
  )
}
