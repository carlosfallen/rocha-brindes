import { memo } from 'react'
import Image from './Image'
import type { Category } from '@/types/product'

interface Props {
  categories: Category[]
  onSelect: (name: string) => void
}

export default memo(function PopularCategories({ categories, onSelect }: Props) {
  if (!categories.length) return null

  return (
    <section className="mb-12">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Categorias mais procuradas
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.nome)}
            className="relative h-28 md:h-32 rounded-xl overflow-hidden group bg-gray-100"
            type="button"
          >
            {cat.imagePath && (
              <Image 
                src={cat.imagePath} 
                alt={cat.nome} 
                width={400} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            <span className="relative z-10 text-white font-semibold text-sm md:text-base px-3 py-2 block">
              {cat.nome}
            </span>
          </button>
        ))}
      </div>
    </section>
  )
})