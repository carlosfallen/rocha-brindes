// src/components/admin/LayoutManager.tsx
import { useState, useEffect } from 'react'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { uploadOptimizedImage } from '@/utils/imageOptimizer'
import { Upload, X } from 'lucide-react'

interface LayoutAssets {
  logo?: string
  banners: string[]
  promotions: string[]
  popups: string[]
}

export default function LayoutManager() {
  const [assets, setAssets] = useState<LayoutAssets>({ banners: [], promotions: [], popups: [] })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const [logoPreview, setLogoPreview] = useState<string>('')
  const [bannerPreviews, setBannerPreviews] = useState<string[]>([])
  const [promotionPreviews, setPromotionPreviews] = useState<string[]>([])
  const [popupPreviews, setPopupPreviews] = useState<string[]>([])

  useEffect(() => {
    loadAssets()
  }, [])

  const loadAssets = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'config', 'layout'))
      if (docSnap.exists()) {
        const data = docSnap.data() as LayoutAssets
        setAssets(data)
        setLogoPreview(data.logo || '')
        setBannerPreviews(data.banners || [])
        setPromotionPreviews(data.promotions || [])
        setPopupPreviews(data.popups || [])
      }
    } catch (error) {
      console.error('Erro ao carregar assets:', error)
    }
  }

  const handleLogoUpload = async (file: File) => {
    setLoading(true)
    try {
      const url = await uploadOptimizedImage(file, `assets/layout/logo/${Date.now()}.webp`)
      setAssets({ ...assets, logo: url })
      setLogoPreview(url)
      await saveAssets({ ...assets, logo: url })
      setMessage('Logo atualizado com sucesso!')
    } catch (error) {
      console.error(error)
      setMessage('Erro ao fazer upload do logo')
    } finally {
      setLoading(false)
    }
  }

  const handleBannerUpload = async (files: FileList) => {
    setLoading(true)
    try {
      const urls: string[] = []
      for (let i = 0; i < files.length; i++) {
        const url = await uploadOptimizedImage(files[i], `assets/layout/banners/${Date.now()}_${i}.webp`)
        urls.push(url)
      }
      const newBanners = [...assets.banners, ...urls]
      setAssets({ ...assets, banners: newBanners })
      setBannerPreviews(newBanners)
      await saveAssets({ ...assets, banners: newBanners })
      setMessage('Banners adicionados com sucesso!')
    } catch (error) {
      console.error(error)
      setMessage('Erro ao fazer upload dos banners')
    } finally {
      setLoading(false)
    }
  }

  const handlePromotionUpload = async (files: FileList) => {
    setLoading(true)
    try {
      const urls: string[] = []
      for (let i = 0; i < files.length; i++) {
        const url = await uploadOptimizedImage(files[i], `assets/layout/promotions/${Date.now()}_${i}.webp`)
        urls.push(url)
      }
      const newPromotions = [...assets.promotions, ...urls]
      setAssets({ ...assets, promotions: newPromotions })
      setPromotionPreviews(newPromotions)
      await saveAssets({ ...assets, promotions: newPromotions })
      setMessage('Promoções adicionadas com sucesso!')
    } catch (error) {
      console.error(error)
      setMessage('Erro ao fazer upload das promoções')
    } finally {
      setLoading(false)
    }
  }

  const handlePopupUpload = async (files: FileList) => {
    setLoading(true)
    try {
      const urls: string[] = []
      for (let i = 0; i < files.length; i++) {
        const url = await uploadOptimizedImage(files[i], `assets/layout/popups/${Date.now()}_${i}.webp`)
        urls.push(url)
      }
      const newPopups = [...assets.popups, ...urls]
      setAssets({ ...assets, popups: newPopups })
      setPopupPreviews(newPopups)
      await saveAssets({ ...assets, popups: newPopups })
      setMessage('Popups adicionados com sucesso!')
    } catch (error) {
      console.error(error)
      setMessage('Erro ao fazer upload dos popups')
    } finally {
      setLoading(false)
    }
  }

  const removeBanner = async (index: number) => {
    const newBanners = assets.banners.filter((_, i) => i !== index)
    setAssets({ ...assets, banners: newBanners })
    setBannerPreviews(newBanners)
    await saveAssets({ ...assets, banners: newBanners })
  }

  const removePromotion = async (index: number) => {
    const newPromotions = assets.promotions.filter((_, i) => i !== index)
    setAssets({ ...assets, promotions: newPromotions })
    setPromotionPreviews(newPromotions)
    await saveAssets({ ...assets, promotions: newPromotions })
  }

  const removePopup = async (index: number) => {
    const newPopups = assets.popups.filter((_, i) => i !== index)
    setAssets({ ...assets, popups: newPopups })
    setPopupPreviews(newPopups)
    await saveAssets({ ...assets, popups: newPopups })
  }

  const saveAssets = async (data: LayoutAssets) => {
    await setDoc(doc(db, 'config', 'layout'), data)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-8">
      <h2 className="text-xl font-title font-bold">Gerenciar Layout da Home</h2>

      {message && (
        <p className={`text-center font-semibold ${message.includes('sucesso') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}

      <div>
        <h3 className="font-semibold text-lg mb-3">Logo Principal</h3>
        {logoPreview ? (
          <div className="relative w-48 h-24 border rounded-lg p-2">
            <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
            <button
              onClick={() => {
                setAssets({ ...assets, logo: '' })
                setLogoPreview('')
                saveAssets({ ...assets, logo: '' })
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <label className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary w-fit">
            <Upload size={20} />
            <span>Fazer upload do logo</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleLogoUpload(file)
              }}
              className="hidden"
              disabled={loading}
            />
          </label>
        )}
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-3">Banners (Hero)</h3>
        <label className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary w-fit mb-4">
          <Upload size={20} />
          <span>Adicionar banners</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              if (e.target.files) handleBannerUpload(e.target.files)
            }}
            className="hidden"
            disabled={loading}
          />
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {bannerPreviews.map((url, i) => (
            <div key={i} className="relative aspect-video border rounded-lg overflow-hidden">
              <img src={url} alt={`Banner ${i + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={() => removeBanner(i)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-3">Promoções em Destaque</h3>
        <label className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary w-fit mb-4">
          <Upload size={20} />
          <span>Adicionar promoções</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              if (e.target.files) handlePromotionUpload(e.target.files)
            }}
            className="hidden"
            disabled={loading}
          />
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {promotionPreviews.map((url, i) => (
            <div key={i} className="relative aspect-square border rounded-lg overflow-hidden">
              <img src={url} alt={`Promoção ${i + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={() => removePromotion(i)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-3">Popups</h3>
        <label className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary w-fit mb-4">
          <Upload size={20} />
          <span>Adicionar popups</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              if (e.target.files) handlePopupUpload(e.target.files)
            }}
            className="hidden"
            disabled={loading}
          />
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {popupPreviews.map((url, i) => (
            <div key={i} className="relative aspect-square border rounded-lg overflow-hidden">
              <img src={url} alt={`Popup ${i + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={() => removePopup(i)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}