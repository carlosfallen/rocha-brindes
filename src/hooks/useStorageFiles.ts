// src/hooks/useStorageFiles.ts
import { useQuery } from '@tanstack/react-query'
import { ref, listAll, getDownloadURL } from 'firebase/storage'
import { storage } from '@/lib/firebase'

async function fetchStorageFiles(path: string) {
  const folder = path.endsWith('/') ? path : `${path}/`
  const folderRef = ref(storage, folder)
  const res = await listAll(folderRef)
  const items = [...res.items].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR', { numeric: true }))
  const urls = await Promise.all(items.map((it) => getDownloadURL(it)))
  return urls
}

export function useStorageFiles(path: string) {
  return useQuery<string[]>({
    queryKey: ['storage-files', path],
    queryFn: () => fetchStorageFiles(path),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  })
}
