import { useState } from 'react'
import { fileToCompressedDataUrl, pickImageFile, trySetItem } from './imageFile'
import { showToast } from './toast'

const STORAGE_KEY = 'oilog-face-photo'

export function getStoredFacePhoto(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(STORAGE_KEY)
}

export function setStoredFacePhoto(dataUrl: string) {
  window.localStorage.setItem(STORAGE_KEY, dataUrl)
}

export function clearStoredFacePhoto() {
  window.localStorage.removeItem(STORAGE_KEY)
}

/** Opens the native photo picker, persists the chosen photo as the user's face photo, and returns its data URL. */
export async function pickAndStoreFacePhoto(): Promise<string | null> {
  const file = await pickImageFile()
  if (!file) return null
  const dataUrl = await fileToCompressedDataUrl(file)
  if (!trySetItem(STORAGE_KEY, dataUrl)) {
    showToast('이미지 저장에 실패했어요. 용량을 확인해주세요.')
    return null
  }
  return dataUrl
}

/** Reads the persisted user-selected face photo and exposes a setter that updates both localStorage and state. */
export function useFacePhoto(fallback: string) {
  const [photo, setPhoto] = useState<string>(() => getStoredFacePhoto() ?? fallback)

  async function pick() {
    const dataUrl = await pickAndStoreFacePhoto()
    if (dataUrl) setPhoto(dataUrl)
  }

  function reset() {
    clearStoredFacePhoto()
    setPhoto(fallback)
  }

  return { photo, pick, reset, isCustom: photo !== fallback } as const
}
