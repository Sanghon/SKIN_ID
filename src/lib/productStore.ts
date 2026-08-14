import { useState } from 'react'
import { mockProducts } from '../services/data/mockProducts'
import type { Product } from '../types/product'
import { fileToCompressedDataUrl, pickImageFile, trySetItem } from './imageFile'
import { showToast } from './toast'

const STORAGE_KEY = 'oilog-products'

function readStored(): Product[] | null {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Product[]
  } catch {
    return null
  }
}

export function getProducts(): Product[] {
  return readStored() ?? mockProducts
}

function saveProducts(products: Product[]): boolean {
  return trySetItem(STORAGE_KEY, JSON.stringify(products))
}

export function resetProducts() {
  window.localStorage.removeItem(STORAGE_KEY)
}

/** Opens the native image picker and resolves to a compressed data URL, or null if cancelled. */
export async function pickImageDataUrl(): Promise<string | null> {
  const file = await pickImageFile()
  if (!file) return null
  return fileToCompressedDataUrl(file)
}

/** Admin CRUD over the care-product catalog, persisted to localStorage. Currently open to everyone (no auth gate yet). */
export function useProductStore() {
  const [products, setProducts] = useState<Product[]>(() => getProducts())

  function addProduct(product: Product) {
    const next = [...products, product]
    setProducts(next)
    if (!saveProducts(next)) showToast('저장에 실패했어요. 용량을 확인해주세요.')
  }

  function updateProduct(id: string, patch: Partial<Product>) {
    const next = products.map((p) => (p.id === id ? { ...p, ...patch } : p))
    setProducts(next)
    if (!saveProducts(next)) showToast('저장에 실패했어요. 용량을 확인해주세요.')
  }

  function removeProduct(id: string) {
    const next = products.filter((p) => p.id !== id)
    setProducts(next)
    saveProducts(next)
  }

  function reset() {
    resetProducts()
    setProducts(mockProducts)
  }

  return { products, addProduct, updateProduct, removeProduct, reset } as const
}
