import { useEffect, useSyncExternalStore } from 'react'
import { addGuidelineImageApi, fetchGuidelineImages, removeGuidelineImageApi, uploadImage } from './api'
import type { GuidelineImageDTO } from './api'
import { fileToCompressedDataUrl, pickImageFile } from './imageFile'
import { showToast } from './toast'

export const MAX_GUIDELINE_IMAGES = 3

let cached: GuidelineImageDTO[] = []
let loaded = false
let loadPromise: Promise<void> | null = null
const listeners = new Set<() => void>()

function notify() {
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return cached
}

function getServerSnapshot(): GuidelineImageDTO[] {
  return []
}

function ensureLoaded(): void {
  if (loaded || loadPromise) return
  loadPromise = fetchGuidelineImages()
    .then((images) => {
      cached = images
      loaded = true
      notify()
    })
    .catch(() => {
      loaded = true
    })
}

/** 촬영 화면 "사용팁" 가이드 이미지(최대 3장). 관리자가 등록·삭제할 수 있다. (현재는 권한 제한 없이 전체 공개) */
export function useGuidelineImages() {
  const entries = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  useEffect(ensureLoaded, [])
  const images = entries.map((e) => e.imageUrl)

  async function addImage() {
    if (entries.length >= MAX_GUIDELINE_IMAGES) return
    const file = await pickImageFile()
    if (!file) return
    const dataUrl = await fileToCompressedDataUrl(file)
    try {
      const imageUrl = await uploadImage(dataUrl, 'guidelines')
      const created = await addGuidelineImageApi(imageUrl)
      cached = [...cached, created]
      notify()
    } catch {
      showToast('이미지 저장에 실패했어요. 다시 시도해주세요.')
    }
  }

  function removeImage(index: number) {
    const entry = entries[index]
    if (!entry) return
    const previous = cached
    cached = cached.filter((e) => e.id !== entry.id)
    notify()
    removeGuidelineImageApi(entry.id).catch(() => {
      cached = previous
      notify()
    })
  }

  return { images, addImage, removeImage, maxImages: MAX_GUIDELINE_IMAGES } as const
}
