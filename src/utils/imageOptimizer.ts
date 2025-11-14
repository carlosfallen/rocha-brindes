// src/utils/imageOptimizer.ts
export async function optimizeImage(file: File, maxWidth = 1200, quality = 0.85): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    img.onload = () => {
      let { width, height } = img

      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }

      canvas.width = width
      canvas.height = height

      ctx?.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to optimize image'))
          }
        },
        'image/webp',
        quality
      )
    }

    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}

export async function uploadOptimizedImage(file: File, path: string): Promise<string> {
  const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage')
  const { storage } = await import('@/lib/firebase')
  
  const optimizedBlob = await optimizeImage(file)
  const optimizedFile = new File([optimizedBlob], `${Date.now()}.webp`, { type: 'image/webp' })
  
  const fileRef = ref(storage, path)
  await uploadBytes(fileRef, optimizedFile)
  return getDownloadURL(fileRef)
}