// src/types/product.ts
export interface Product {
  id: string
  nome: string
  descricao?: string
  categorias: string[]
  imagens_urls: string[]
  imagem_url: string
  variacoes?: string[]
  destaque?: boolean
  createdAt: Date
}

export interface Category {
  id: string
  nome: string
  productCount: number
}