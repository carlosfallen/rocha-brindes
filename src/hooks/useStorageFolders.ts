// src/hooks/useStorageFolders.ts
import { useQuery } from '@tanstack/react-query'
import { ref, listAll } from 'firebase/storage'
import { storage } from '@/lib/firebase'

// Retorna nomes de subpastas em /Category/, ou (fallback) nomes de arquivos sem extensão
async function fetchStorageFolders(path: string) {
  const folder = path.endsWith('/') ? path : `${path}/`
  const folderRef = ref(storage, folder)
  const res = await listAll(folderRef)

  // 1) Preferir subpastas
  if (res.prefixes.length > 0) {
    return res.prefixes
      .map((p) => p.name)
      .sort((a, b) => a.localeCompare(b, 'pt-BR', { numeric: true }))
  }

  // 2) Fallback: usar nomes de arquivos como categorias (sem extensão)
  const names = res.items
    .map((it) => it.name.replace(/\.[^.]+$/, ''))
    .sort((a, b) => a.localeCompare(b, 'pt-BR', { numeric: true }))

  // Remover duplicados
  return Array.from(new Set(names))
}

export function useStorageFolders(path: string) {
  return useQuery<string[]>({
    queryKey: ['storage-folders', path],
    queryFn: () => fetchStorageFolders(path),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  })
}
