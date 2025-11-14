import { memo } from 'react'
import { Search } from 'lucide-react'

interface Props {
  categories: string[]
  selected: string
  onSelect: (category: string) => void
  search: string
  onSearch: (term: string) => void
}

export default memo(function CategorySidebar({ categories, selected, onSelect, search, onSearch }: Props) {
  return (
    <aside className="sticky top-24 h-fit">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Buscar produtos..."
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-bold text-lg mb-4">Categorias</h3>
        <div className="space-y-2">
          <button
            onClick={() => onSelect('Todos')}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${
              selected === 'Todos'
                ? 'bg-primary text-white'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            Todos os produtos
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => onSelect(cat)}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${
                selected === cat
                  ? 'bg-primary text-white'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
})