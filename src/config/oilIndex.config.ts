import type { SkinCharacterId, SkinType } from '../types/skin'

/** Oil Index = weights.coverage * oilCoverage + weights.intensity * oilIntensity */
export const OIL_INDEX_WEIGHTS = {
  coverage: 0.6,
  intensity: 0.4,
} as const

export interface SkinTypeThreshold {
  type: SkinType
  min: number
}

/** Ascending min-bounds; a score falls into the highest bound it meets or exceeds. */
export const SKIN_TYPE_THRESHOLDS: SkinTypeThreshold[] = [
  { type: '극건성', min: 0 },
  { type: '건성', min: 20 },
  { type: '중성', min: 40 },
  { type: '지성', min: 60 },
  { type: '극지성', min: 80 },
]

/** If (tZoneScore - uZoneScore) >= this value, classification is overridden to 복합성. */
export const COMBINATION_OVERRIDE_THRESHOLD = 25

export const COMBINATION_CHARACTER: SkinCharacterId = 'double-life'

export const SKIN_TYPE_TO_CHARACTER: Record<SkinType, SkinCharacterId> = {
  극건성: 'sahara',
  건성: 'cactus',
  중성: 'balance',
  지성: 'oil-field',
  극지성: 'oil-king',
  복합성: COMBINATION_CHARACTER,
}
