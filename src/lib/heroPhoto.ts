import { useState } from 'react'
import { pickImageFile, trySetItem } from './imageFile'
import { showToast } from './toast'

const STORAGE_KEY = 'oilog-hero-photo'

function readStoredHeroPhoto(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(STORAGE_KEY)
}

/** Home 화면 대표 이미지. 관리자가 사진을 클릭해 교체할 수 있고, localStorage에 영구 저장된다. (현재는 권한 제한 없이 전체 공개) */
export function useHeroPhoto(fallback: string) {
  const [photo, setPhoto] = useState<string>(() => readStoredHeroPhoto() ?? fallback)

  async function pickRaw(): Promise<string | null> {
    const file = await pickImageFile()
    if (!file) return null
    return URL.createObjectURL(file)
  }

  function commit(dataUrl: string) {
    if (trySetItem(STORAGE_KEY, dataUrl)) {
      setPhoto(dataUrl)
    } else {
      showToast('이미지 저장에 실패했어요. 용량을 확인해주세요.')
    }
  }

  return { photo, pickRaw, commit } as const
}
