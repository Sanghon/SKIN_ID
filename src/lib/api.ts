import type { Measurement, OilAnalysisResult } from '../types/measurement'
import type { Product, RoutineEvent } from '../types/product'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { 'content-type': 'application/json', ...init?.headers },
  })
  if (!res.ok) throw new Error(`API ${path} failed with ${res.status}`)
  return res.json() as Promise<T>
}

/** Uploads a data: URL (or blob: URL) to R2 via the Pages Functions API and returns its public /api/images path. */
export async function uploadImage(sourceUrl: string, folder: string): Promise<string> {
  const blob = await (await fetch(sourceUrl)).blob()
  const form = new FormData()
  form.append('file', blob, 'upload')
  form.append('folder', folder)
  const res = await fetch('/api/upload', { method: 'POST', body: form })
  if (!res.ok) throw new Error('Image upload failed')
  const { url } = (await res.json()) as { url: string }
  return url
}

export const fetchProducts = () => request<Product[]>('/api/products')

export const createProductApi = (body: Partial<Product> & { name: string }) =>
  request<Product>('/api/products', { method: 'POST', body: JSON.stringify(body) })

export const updateProductApi = (id: string, patch: Partial<Product>) =>
  request<Product>(`/api/products/${id}`, { method: 'PATCH', body: JSON.stringify(patch) })

export const deleteProductApi = (id: string) =>
  request<{ ok: boolean }>(`/api/products/${id}`, { method: 'DELETE' })

export const fetchMeasurements = () => request<Measurement[]>('/api/measurements')

export const createMeasurementApi = (body: { capturedAt: string; imageUrl?: string; result: OilAnalysisResult }) =>
  request<Measurement>('/api/measurements', { method: 'POST', body: JSON.stringify(body) })

export const fetchRoutineEvents = () => request<RoutineEvent[]>('/api/routine-events')

export const createRoutineEventApi = (body: { measurementId: string; productId: string; note?: string }) =>
  request<RoutineEvent>('/api/routine-events', { method: 'POST', body: JSON.stringify(body) })

export const fetchWishlist = () => request<string[]>('/api/wishlist')

export const addWishlistApi = (productId: string) =>
  request<{ ok: boolean }>(`/api/wishlist/${productId}`, { method: 'POST' })

export const removeWishlistApi = (productId: string) =>
  request<{ ok: boolean }>(`/api/wishlist/${productId}`, { method: 'DELETE' })

export const fetchHeroPhoto = () => request<{ url: string }>('/api/settings/hero-photo')

export const setHeroPhotoApi = (url: string) =>
  request<{ url: string }>('/api/settings/hero-photo', { method: 'PUT', body: JSON.stringify({ url }) })

export interface GuidelineImageDTO {
  id: string
  imageUrl: string
  position: number
}

export const fetchGuidelineImages = () => request<GuidelineImageDTO[]>('/api/guideline-images')

export const addGuidelineImageApi = (imageUrl: string) =>
  request<GuidelineImageDTO>('/api/guideline-images', { method: 'POST', body: JSON.stringify({ imageUrl }) })

export const removeGuidelineImageApi = (id: string) =>
  request<{ ok: boolean }>(`/api/guideline-images/${id}`, { method: 'DELETE' })
