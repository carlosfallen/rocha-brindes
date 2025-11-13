// src/components/CartSidebar.tsx
import { useProductStore } from '@/store/useProductStore'
import { X, Trash2 } from 'lucide-react'
import { useState } from 'react'

export default function CartSidebar() {
  const { cart, isCartOpen, toggleCart, removeFromCart, clearCart } = useProductStore()
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
    
    cart.forEach(item => {
      message += `• ${item.nome} (Cód: ${item.id}) - Qtd: ${item.quantity}\n`
    })
    
    if (formData.obs) {
      message += `\n*Observações:* ${formData.obs}`
    }

    const whatsappUrl = `https://wa.me/5589994333316?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    
    clearCart()
    toggleCart()
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity ${
          isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleCart}
      />
      
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-title font-bold">Seu Orçamento</h2>
            <button onClick={toggleCart} className="p-2 hover:bg-gray-100 rounded-full">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <p className="text-center text-gray-500 py-12">Nenhum produto adicionado</p>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex gap-4 bg-gray-50 p-4 rounded-lg">
                  <img
                    src={item.imagem_url}
                    alt={item.nome}
                    className="w-20 h-20 object-contain rounded-lg bg-white"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm line-clamp-2">{item.nome}</h3>
                    <p className="text-xs text-gray-500">Qtd: {item.quantity}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg h-fit"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <form onSubmit={handleSubmit} className="p-6 border-t space-y-3">
              <input
                type="text"
                placeholder="Nome / Razão Social"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
              <input
                type="text"
                placeholder="CPF / CNPJ"
                value={formData.doc}
                onChange={(e) => setFormData({...formData, doc: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
              <input
                type="text"
                placeholder="Endereço completo"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
              <input
                type="text"
                placeholder="CEP"
                value={formData.cep}
                onChange={(e) => setFormData({...formData, cep: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
              <textarea
                placeholder="Observações adicionais"
                value={formData.obs}
                onChange={(e) => setFormData({...formData, obs: e.target.value})}
                rows={3}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary resize-none"
              />
              <button
                type="submit"
                className="w-full bg-primary hover:opacity-90 text-text-primary font-bold py-4 rounded-lg transition-all"
              >
                Enviar via WhatsApp
              </button>
            </form>
          )}
        </div>
      </aside>
    </>
  )
}