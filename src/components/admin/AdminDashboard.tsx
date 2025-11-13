// src/components/admin/AdminDashboard.tsx
import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import ProductForm from '@/components/admin/ProductForm'
import ProductList from './ProductList'
import CategoryManager from '@/components/admin/CategoryManager'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products')

  const handleLogout = async () => {
    await signOut(auth)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-title font-bold">Painel Admin</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Sair
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'products'
                ? 'bg-primary text-text-primary'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Produtos
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'categories'
                ? 'bg-primary text-text-primary'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Categorias
          </button>
        </div>

        {activeTab === 'products' ? (
          <div className="space-y-8">
            <ProductForm />
            <ProductList />
          </div>
        ) : (
          <CategoryManager />
        )}
      </div>
    </div>
  )
}