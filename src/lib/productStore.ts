import { useState } from 'react'
import { mockProducts } from '../services/data/store'
import type { Product } from '../types/product'
import { createProductApi, deleteProductApi, updateProductApi, uploadImage } from './api'
import { fileToCompressedDataUrl, pickImageFile } from './imageFile'
import { showToast } from './toast'

/** Opens the native image picker, compresses it, uploads it to R2, and resolves to its served URL (or null if cancelled/failed). */
export async function pickImageDataUrl(): Promise<string | null> {
  const file = await pickImageFile()
  if (!file) return null
  const dataUrl = await fileToCompressedDataUrl(file)
  try {
    return await uploadImage(dataUrl, 'products')
  } catch {
    showToast('이미지 업로드에 실패했어요.')
    return null
  }
}

/** Admin CRUD over the care-product catalog, backed by the D1 API. Currently open to everyone (no auth gate yet). */
export function useProductStore() {
  const [products, setProducts] = useState<Product[]>(mockProducts)

  function addProduct(product: Product) {
    setProducts((prev) => [...prev, product])
    createProductApi(product).catch(() => {
      showToast('저장에 실패했어요. 다시 시도해주세요.')
      setProducts((prev) => prev.filter((p) => p.id !== product.id))
    })
  }

  function updateProduct(id: string, patch: Partial<Product>) {
    const previous = products
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
    updateProductApi(id, patch).catch(() => {
      showToast('저장에 실패했어요. 다시 시도해주세요.')
      setProducts(previous)
    })
  }

  function removeProduct(id: string) {
    const previous = products
    setProducts((prev) => prev.filter((p) => p.id !== id))
    deleteProductApi(id).catch(() => {
      showToast('삭제에 실패했어요. 다시 시도해주세요.')
      setProducts(previous)
    })
  }

  function reset() {
    setProducts(mockProducts)
  }

  return { products, addProduct, updateProduct, removeProduct, reset } as const
}
