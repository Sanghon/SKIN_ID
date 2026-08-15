import { useEffect, useState } from 'react'
import { fetchHeroPhoto, setHeroPhotoApi, uploadImage } from './api'
import { pickImageFile } from './imageFile'
import { showToast } from './toast'

/** Home 화면 대표 이미지. 관리자가 사진을 클릭해 교체할 수 있고, D1/R2에 영구 저장된다. (현재는 권한 제한 없이 전체 공개) */
export function useHeroPhoto(fallback: string) {
  const [photo, setPhoto] = useState<string>(fallback)

  useEffect(() => {
    let cancelled = false
    fetchHeroPhoto()
      .then(({ url }) => {
        if (!cancelled && url) setPhoto(url)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  async function pickRaw(): Promise<string | null> {
    const file = await pickImageFile()
    if (!file) return null
    return URL.createObjectURL(file)
  }

  function commit(dataUrl: string) {
    const previous = photo
    setPhoto(dataUrl)
    uploadImage(dataUrl, 'hero')
      .then((url) => setHeroPhotoApi(url).then(() => setPhoto(url)))
      .catch(() => {
        showToast('이미지 저장에 실패했어요. 다시 시도해주세요.')
        setPhoto(previous)
      })
  }

  return { photo, pickRaw, commit } as const
}
