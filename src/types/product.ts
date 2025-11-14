// src/types/product.ts
export interface Product {
  id: string
  nome: string
  descricao?: string
  cor: string
  categorias: string[]
  imagens_urls: string[]
  thumbs_urls?: string[]
  imagem_url: string
  thumb_url?: string 
  variacoes?: ProductVariation[]
  destaque?: boolean
  createdAt: Date
}

export interface ProductVariation {
  cor: string
  imagem_url: string
  thumb_url?: string
}

export interface Category {
  id: string
  nome: string
  productCount: number
  popular?: boolean
  imagePath?: string
}