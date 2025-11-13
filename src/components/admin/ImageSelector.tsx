// src/components/admin/ImageSelector.tsx
import { useState } from 'react'
import StorageImagePicker from './StorageImagePicker'

type Props = {
  /** Pasta do Storage (ex.: "produtos" ou "Category") */
  prefix: string
  /** Várias imagens? */
  multiple?: boolean
  /** Caminho base para upload (sem barra final). Ex.: "produtos" */
  uploadBasePath?: string
  /** Callback quando mudar a lista de arquivos selecionados para upload */
  onFilesChange?: (files: File[]) => void
  /** Callback quando mudar a lista de URLs escolhidas do Storage */
  onUrlsChange?: (urls: string[]) => void
}

export default function ImageSelector({
  prefix,
  multiple = true,
  uploadBasePath = prefix,
  onFilesChange,
  onUrlsChange,
}: Props) {
  const [mode, setMode] = useState<'upload' | 'choose'>('upload')
  const [pickerOpen, setPickerOpen] = useState(false)
  const [localFiles, setLocalFiles] = useState<File[]>([])
  const [chosenUrls, setChosenUrls] = useState<string[]>([])
  const [subfolder, setSubfolder] = useState('') // opcional: prefixo extra (ex.: "camisetas")

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    setLocalFiles(files)
    onFilesChange?.(files)
  }

  function handleChoose(url: string) {
    const next = multiple ? Array.from(new Set([...chosenUrls, url])) : [url]
    setChosenUrls(next)
    onUrlsChange?.(next)
  }

  function removeChosen(url: string) {
    const next = chosenUrls.filter((u) => u !== url)
    setChosenUrls(next)
    onUrlsChange?.(next)
  }

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`px-3 py-2 rounded border ${mode === 'upload' ? 'bg-gray-900 text-white' : 'bg-white'}`}
        >
          Enviar arquivo
        </button>
        <button
          type="button"
          onClick={() => setMode('choose')}
          className={`px-3 py-2 rounded border ${mode === 'choose' ? 'bg-gray-900 text-white' : 'bg-white'}`}
        >
          Escolher do Storage
        </button>
      </div>

      {mode === 'upload' ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Pasta base:</span>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">{uploadBasePath}</code>
            <span className="text-sm text-gray-600">/</span>
            <input
              value={subfolder}
              onChange={(e) => setSubfolder(e.target.value)}
              placeholder="subpasta (opcional)"
              className="px-2 py-1 border rounded text-sm"
            />
          </div>
          <input
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={handleFileInput}
            className="block w-full text-sm"
          />
          {localFiles.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {localFiles.map((f, i) => (
                <div key={i} className="text-xs">
                  <div className="aspect-square overflow-hidden rounded border">
                    <img src={URL.createObjectURL(f)} alt={f.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="truncate mt-1">{f.name}</div>
                </div>
              ))}
            </div>
          )}
          {/* Exponha subpasta escolhida para o pai via atributo data-* (opcional) */}
          <input type="hidden" name="__image_subfolder" value={subfolder} />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="px-3 py-2 rounded border"
            >
              Abrir imagens de {prefix}/
            </button>
          </div>
          {chosenUrls.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {chosenUrls.map((u) => (
                <div key={u} className="relative">
                  <div className="aspect-square overflow-hidden rounded border">
                    <img src={u} alt="" className="w-full h-full object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeChosen(u)}
                    className="absolute top-1 right-1 bg-white/80 rounded px-1 text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <StorageImagePicker
            open={pickerOpen}
            onClose={() => setPickerOpen(false)}
            prefix={prefix}
            onSelect={(_fileName, url) => handleChoose(url)}
          />
        </div>
      )}
    </div>
  )
}
