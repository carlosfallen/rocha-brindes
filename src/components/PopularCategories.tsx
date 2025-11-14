interface CategoryItem {
  name: string
  image: string
}

interface PopularCategoriesProps {
  onSelectCategory: (category: string) => void
  categories?: CategoryItem[] // opcional
}

const defaultCategories: CategoryItem[] = [
  { name: 'Garrafas', image: '/assets/images/categorias/garrafas.jpg' },
  { name: 'Chaveiros', image: '/assets/images/categorias/chaveiros.jpg' },
  { name: 'Bonés', image: '/assets/images/categorias/bones.jpg' },
  { name: 'Canetas', image: '/assets/images/categorias/canetas.jpg' },
]

export default function PopularCategories({
  onSelectCategory,
  categories,
}: PopularCategoriesProps) {
  // se não vier nada por props, usa as categorias padrão
  const items = categories && categories.length > 0 ? categories : defaultCategories

  if (!items.length) return null

  return (
    <section className="mb-12">
      <h2 className="text-2xl md:text-3xl font-title font-bold text-text-primary mb-6">
        Categorias mais procuradas
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((cat) => (
          <button
            key={cat.name}
            onClick={() => onSelectCategory(cat.name)}
            className="relative h-28 md:h-32 rounded-xl overflow-hidden group bg-gray-100 text-left"
            type="button"
          >
            <img
              src={cat.image}
              alt={cat.name}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

            <span className="relative z-10 text-white font-semibold text-sm md:text-base px-3 py-2 block">
              {cat.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
