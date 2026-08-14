import { useSyncExternalStore } from 'react'
import { fileToCompressedDataUrl, pickImageFile, trySetItem } from './imageFile'
import { showToast } from './toast'

const STORAGE_KEY = 'oilog-guideline-images'
export const MAX_GUIDELINE_IMAGES = 3

function readStored(): string[] {
  if (typeof window === 'undefined') return []
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? (parsed as string[]) : []
  } catch {
    return []
  }
}

let cached: string[] = readStored()
const listeners = new Set<() => void>()

function persist(next: string[]): boolean {
  const ok = trySetItem(STORAGE_KEY, JSON.stringify(next))
  if (ok) {
    cached = next
    listeners.forEach((listener) => listener())
  }
  return ok
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return cached
}

function getServerSnapshot() {
  return []
}

/** 촬영 화면 "사용팁" 가이드 이미지(최대 3장). 관리자가 등록·삭제할 수 있다. (현재는 권한 제한 없이 전체 공개) */
export function useGuidelineImages() {
  const images = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  async function addImage() {
    if (images.length >= MAX_GUIDELINE_IMAGES) return
    const file = await pickImageFile()
    if (!file) return
    const dataUrl = await fileToCompressedDataUrl(file)
    const ok = persist([...images, dataUrl])
    if (!ok) showToast('이미지 저장에 실패했어요. 용량을 확인해주세요.')
  }

  function removeImage(index: number) {
    persist(images.filter((_, i) => i !== index))
  }

  return { images, addImage, removeImage, maxImages: MAX_GUIDELINE_IMAGES } as const
}
