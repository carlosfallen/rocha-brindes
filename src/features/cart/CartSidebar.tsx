import { useState } from 'react'
import { X, Trash2 } from 'lucide-react'
import { useCart } from '@/core/store/cart'
import Image from '@/shared/components/Image'

export default function CartSidebar() {
  const { items, isOpen, toggle, remove, clear } = useCart()
  const [formData, setFormData] = useState({
    name: '',
    doc: '',
    address: '',
    cep: '',
    obs: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    let message = `*Orçamento - Rocha Brindes*\n\n`
    message += `*Cliente:* ${formData.name}\n`
    message += `*CPF/CNPJ:* ${formData.doc}\n`
    message += `*Endereço:* ${formData.address}\n`
    message += `*CEP:* ${formData.cep}\n\n`
    message += `*Produtos:*\n`
    
    items.forEach(item => {
      message += `• ${item.nome} (Cód: ${item.id}) - Qtd: ${item.quantity}\n`
    })
    
    if (formData.obs) {
      message += `\n*Observações:* ${formData.obs}`
    }

    const whatsappUrl = `https://wa.me/5589994333316?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    
    clear()
    toggle()
    setFormData({ name: '', doc: '', address: '', cep: '', obs: '' })
  }

  return (
    <>
      {/* backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggle}
      />

      {/* sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          
          {/* header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold">Seu Orçamento</h2>
            <button
              onClick={toggle}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <X size={24} />
            </button>
          </div>

          {/* items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <p className="text-center text-gray-500 py-12">
                Nenhum produto adicionado
              </p>
            ) : (
              items.map(item => {
                const img =
                  item.thumb_url ||
                  item.imagem_url ||
                  item.variacoes?.[0]?.thumb_url

                return (
                  <div
                    key={item.id}
                    className="flex gap-4 bg-gray-50 p-4 rounded-lg"
                  >
                    {img && (
                      <Image
                        src={img}
                        alt={item.nome}
                        width={80}
                        height={80}
                        className="w-20 h-20 object-contain rounded-lg bg-white"
                      />
                    )}

                    <div className="flex-1">
                      <h3 className="font-semibold text-sm line-clamp-2">
                        {item.nome}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Qtd: {item.quantity}
                      </p>
                    </div>

                    <button
                      onClick={() => remove(item.id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-lg h-fit transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )
              })
            )}
          </div>

          {/* form */}
          {items.length > 0 && (
            <form onSubmit={handleSubmit} className="p-6 border-t space-y-3">
              <input
                type="text"
                placeholder="Nome completo"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                required
              />

              <input
                type="text"
                placeholder="CPF/CNPJ"
                value={formData.doc}
                onChange={(e) =>
                  setFormData({ ...formData, doc: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                required
              />

              <input
                type="text"
                placeholder="Endereço"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                required
              />

              <input
                type="text"
                placeholder="CEP"
                value={formData.cep}
                onChange={(e) =>
                  setFormData({ ...formData, cep: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                required
              />

              <textarea
                placeholder="Observações (opcional)"
                value={formData.obs}
                onChange={(e) =>
                  setFormData({ ...formData, obs: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />

              <button
                type="submit"
                className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition"
              >
                Finalizar pedido no WhatsApp
              </button>
            </form>
          )}
        </div>
      </aside>
    </>
  )
}
