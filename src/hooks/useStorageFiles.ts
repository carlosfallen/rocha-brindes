// src/hooks/useStorageFiles.ts
import { useQuery } from '@tanstack/react-query'
import { ref, listAll, getDownloadURL } from 'firebase/storage'
import { storage } from '@/lib/firebase'

interface UseStorageFilesOptions {
  paginated?: boolean
  pageSize?: number
}

interface StorageFile {
  name: string
  fullPath: string
  url: string
}

export function useStorageFiles(prefix: string, options?: UseStorageFilesOptions) {
  return useQuery<StorageFile[] | string[]>({
    queryKey: ['storage-files', prefix, options?.paginated, options?.pageSize],
    queryFn: async () => {
      const folderRef = ref(storage, prefix)
      const result = await listAll(folderRef)
      
      const files = await Promise.all(
        result.items.map(async (item) => {
          const url = await getDownloadURL(item)
          return {
            name: item.name,
            fullPath: item.fullPath,
            url
          }
        })
      )

      if (options?.paginated) {
        return files.slice(0, options.pageSize || 100)
      }

      return files.map(f => f.url)
    },
    staleTime: 10 * 60 * 1000
  })
}