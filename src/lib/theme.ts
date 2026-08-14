import { useState } from 'react'

export type BrandTheme = 'lime' | 'warm' | 'teen' | 'cool'

export interface BrandThemeMeta {
  id: BrandTheme
  name: string
  description: string
  swatch: [string, string, string]
}

export const BRAND_THEMES: BrandThemeMeta[] = [
  {
    id: 'lime',
    name: '오리지널 라임',
    description: '기존 OILOG 라임그린 팔레트',
    swatch: ['#b6ff2e', '#16294d', '#ffffff'],
  },
  {
    id: 'warm',
    name: '웜 플럼',
    description: '벤치마킹 목업 기반 웜아이보리 · 딥플럼 팔레트',
    swatch: ['#493646', '#c9bed6', '#ffffff'],
  },
  {
    id: 'teen',
    name: '틴에이저 팝',
    description: '핫핑크 · 바이올렛의 화사한 Z세대 감성 팔레트',
    swatch: ['#ff2e93', '#7b2ff7', '#ffffff'],
  },
  {
    id: 'cool',
    name: '쿨 스카이',
    description: '차분한 블루 · 틸 톤의 쿨톤 팔레트',
    swatch: ['#2f6fed', '#16232f', '#ffffff'],
  },
]

const VALID_THEMES: BrandTheme[] = BRAND_THEMES.map((t) => t.id)
const STORAGE_KEY = 'oilog-brand-theme'

export function getStoredBrandTheme(): BrandTheme {
  if (typeof window === 'undefined') return 'lime'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return (VALID_THEMES as string[]).includes(stored ?? '') ? (stored as BrandTheme) : 'lime'
}

export function applyBrandTheme(theme: BrandTheme) {
  if (theme === 'lime') {
    delete document.documentElement.dataset.brand
  } else {
    document.documentElement.dataset.brand = theme
  }
}

export function setBrandTheme(theme: BrandTheme) {
  window.localStorage.setItem(STORAGE_KEY, theme)
  applyBrandTheme(theme)
}

/** Reads the persisted brand preset and exposes a setter that updates both localStorage and the live DOM. */
export function useBrandTheme() {
  const [theme, setTheme] = useState<BrandTheme>(() => getStoredBrandTheme())

  function update(next: BrandTheme) {
    setBrandTheme(next)
    setTheme(next)
  }

  return [theme, update] as const
}
