// src/components/admin/StorageImagePicker.tsx
import { useState } from 'react'
import { useStorageFiles } from '@/hooks/useStorageFiles'

type Props = {
  open: boolean
  onClose: () => void
  prefix: string
  onSelect: (fileName: string, url: string) => void
}

export default function StorageImagePicker({ open, onClose, prefix, onSelect }: Props) {
  const [search, setSearch] = useState('')
  const { data: files = [], isLoading } = useStorageFiles(prefix, { paginated: true, pageSize: 100 })

  if (!open) return null
  const filtered = files.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-[95vw] max-w-3xl max-h-[85vh] bg-white rounded-xl shadow-lg p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Buscar em ${prefix}/ ...`}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
          />
          <button onClick={onClose} className="px-4 py-2 rounded-lg border">Fechar</button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-lg bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-500 py-8">Nenhuma imagem encontrada em {prefix}/</div>
        ) : (
          <div className="overflow-auto grid grid-cols-3 md:grid-cols-4 gap-3 pr-1">
            {filtered.map((f) => (
              <button
                key={f.fullPath}
                onClick={() => { onSelect(f.name, f.url); onClose() }}
                title={f.name}
                className="group relative aspect-square rounded-lg overflow-hidden border hover:shadow-md"
              >
                <img src={f.url} alt={f.name} loading="lazy" className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-xs px-2 py-1 truncate">
                  {f.name}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
