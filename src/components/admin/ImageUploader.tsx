// src/components/admin/ImageUploader.tsx
import { useRef } from 'react'
import { Upload, X } from 'lucide-react'

interface ImageUploaderProps {
  images: File[]
  onChange: (files: File[]) => void
}

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    const newImages = Array.from(files).filter((file) => file.type.startsWith('image/'))
    onChange([...images, ...newImages])
  }

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index))
  }

  return (
    <div>
      <label className="block text-sm font-semibold mb-2">Imagens</label>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          handleFiles(e.dataTransfer.files)
        }}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
      >
        <Upload className="mx-auto mb-4 text-gray-400" size={48} />
        <p className="text-gray-600">Arraste imagens ou clique para selecionar</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-4 mt-4">
          {images.map((file, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
              <img src={URL.createObjectURL(file)} alt={`Preview ${index}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}