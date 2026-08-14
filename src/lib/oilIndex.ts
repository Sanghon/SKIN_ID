import {
  COMBINATION_CHARACTER,
  COMBINATION_OVERRIDE_THRESHOLD,
  OIL_INDEX_WEIGHTS,
  SKIN_TYPE_THRESHOLDS,
  SKIN_TYPE_TO_CHARACTER,
} from '../config/oilIndex.config'
import type { SkinCharacterId, SkinType } from '../types/skin'

export function calcOilScore(oilCoverage: number, oilIntensity: number): number {
  const score = OIL_INDEX_WEIGHTS.coverage * oilCoverage + OIL_INDEX_WEIGHTS.intensity * oilIntensity
  return Math.round(Math.min(100, Math.max(0, score)))
}

export function classifySkinType(oilScore: number): SkinType {
  const sorted = [...SKIN_TYPE_THRESHOLDS].sort((a, b) => a.min - b.min)
  let result = sorted[0].type
  for (const threshold of sorted) {
    if (oilScore >= threshold.min) result = threshold.type
  }
  return result
}

export function isCombinationOverride(tZoneScore: number, uZoneScore: number): boolean {
  return tZoneScore - uZoneScore >= COMBINATION_OVERRIDE_THRESHOLD
}

export function resolveSkinCharacter(
  skinType: SkinType,
  tZoneScore: number,
  uZoneScore: number,
): SkinCharacterId {
  if (isCombinationOverride(tZoneScore, uZoneScore)) return COMBINATION_CHARACTER
  return SKIN_TYPE_TO_CHARACTER[skinType]
}
