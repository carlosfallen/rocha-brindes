// src/components/PopularCategories.tsx
import OptimizedImage from './OptimizedImage'

type PopularCategory = {
  id: string
  nome: string
  popular?: boolean
  imagePath?: string
}

interface PopularCategoriesProps {
  categories: PopularCategory[]
  onSelectCategory: (category: string) => void
}

export default function PopularCategories({ categories, onSelectCategory }: PopularCategoriesProps) {
  const popular = categories
    .filter((cat) => cat.popular)
    .slice(0, 4)

  if (!popular.length) return null

  return (
    <section className="mb-8 md:mb-12">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-2xl md:text-3xl font-title font-bold text-text-primary">
          Categorias em destaque
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {popular.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.nome)}
            className="relative h-28 md:h-32 rounded-xl overflow-hidden group bg-gray-100 text-left"
          >
            {cat.imagePath && (
              <OptimizedImage
                src={cat.imagePath}
                alt={cat.nome}
                width={400}
                quality={75}
                className="brightness-90 group-hover:brightness-100 transition-all object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <h3 className="absolute bottom-3 left-3 right-3 text-white font-title font-bold text-sm md:text-base">
              {cat.nome}
            </h3>
          </button>
        ))}
      </div>
    </section>
  )
}
