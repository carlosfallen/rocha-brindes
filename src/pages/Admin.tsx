// src/pages/Admin.tsx
import { lazy, Suspense } from 'react'
import { useAuth } from '@/hooks/useAuth'

const AdminDashboard = lazy(() => import('@/components/admin/AdminDashboard'))
const LoginForm = lazy(() => import('@/components/admin/LoginForm'))

export default function Admin() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <Suspense fallback={<div>Carregando...</div>}>
        <LoginForm />
      </Suspense>
    )
  }

  return (
    <Suspense fallback={<div>Carregando painel...</div>}>
      <AdminDashboard />
    </Suspense>
  )
}