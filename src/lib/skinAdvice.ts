import type { SkinType } from '../types/skin'

export type AdviceTone = 'accent' | 'coral' | 'yellow' | 'lab'

export interface Advice {
  label: string
  tone: AdviceTone
}

export function getUvAdvice(uvIndex: number): Advice {
  if (uvIndex >= 8) return { label: 'SPF50+, PA+++', tone: 'coral' }
  if (uvIndex >= 4) return { label: 'SPF15~, PA++', tone: 'yellow' }
  return { label: '자외선 낮음', tone: 'accent' }
}

export function getHumidityAdvice(humidity: number): Advice {
  if (humidity < 40) return { label: '건조주의', tone: 'coral' }
  if (humidity > 65) return { label: '눅눅함', tone: 'lab' }
  return { label: '쾌적', tone: 'accent' }
}

export function getTempAdvice(tempHigh: number): Advice {
  if (tempHigh >= 28) return { label: '더움 · 피지↑', tone: 'coral' }
  if (tempHigh <= 5) return { label: '건조 · 보습↑', tone: 'lab' }
  return { label: '쾌적', tone: 'accent' }
}

/** Ring/marker color for an oil score, echoing WAYSKIN's semantic moisture coding but tuned to sebum: blue = dry, green = balanced, coral = oily. */
export function getOilScoreTone(oilScore: number): AdviceTone {
  if (oilScore < 40) return 'lab'
  if (oilScore < 60) return 'accent'
  if (oilScore < 80) return 'yellow'
  return 'coral'
}

export const TONE_VAR: Record<AdviceTone, string> = {
  accent: 'var(--accent)',
  coral: 'var(--pop-coral)',
  yellow: 'var(--pop-yellow)',
  lab: 'var(--lab)',
}

export function getOilScoreColorVar(oilScore: number): string {
  return TONE_VAR[getOilScoreTone(oilScore)]
}

/** Shared score→color legend: the single source of truth for what each band/tone means, in score order. */
export const SCORE_LEGEND: { tone: AdviceTone; label: string; range: [number, number] }[] = [
  { tone: 'lab', label: '건조', range: [0, 40] },
  { tone: 'accent', label: '균형 · 적정', range: [40, 60] },
  { tone: 'yellow', label: '유분 많음 (지성)', range: [60, 80] },
  { tone: 'coral', label: '유분 매우 많음 (악지성)', range: [80, 100] },
]

const SKIN_TYPE_LABEL: Record<SkinType, string> = {
  극건성: '매우 건조',
  건성: '건조',
  중성: '균형',
  지성: '유분 많음',
  극지성: '유분 매우 많음',
  복합성: '복합성',
}

export function getSkinTypeLabel(skinType: SkinType): string {
  return SKIN_TYPE_LABEL[skinType]
}

/** One-line environment → skin → action summary, the same causal pairing WAYSKIN uses (미세먼지42 → 딥클렌징), adapted to oil score. */
export function buildSkinInsight(oilScore: number, humidity: number, tempHigh: number): string {
  if (humidity < 40 && oilScore >= 60) {
    return '공기가 건조한데도 피지는 많이 관찰돼요 · 가벼운 클렌징을 추천해요'
  }
  if (tempHigh >= 28 && oilScore >= 60) {
    return '더운 날씨로 피지 분비가 늘고 있어요 · 산뜻한 케어를 추천해요'
  }
  if (oilScore < 40) {
    return '오늘 피부는 촉촉한 편이에요 · 보습을 챙겨주세요'
  }
  if (oilScore < 60) {
    return '오늘 피부는 안정적인 상태예요'
  }
  return '평소보다 유분이 많이 관찰돼요 · 피지 케어를 추천해요'
}
