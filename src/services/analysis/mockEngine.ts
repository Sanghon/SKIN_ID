import { calcOilScore, classifySkinType, resolveSkinCharacter } from '../../lib/oilIndex'
import { FACE_ZONES } from '../../types/measurement'
import type { OilAnalysisInput, OilAnalysisResult } from '../../types/measurement'
import type { ZoneScore } from '../../types/skin'
import type { OilAnalysisEngine } from './analysis.types'

function seededRandom(seed: number) {
  let value = seed
  return () => {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

function hashString(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash) || 1
}

/**
 * Deterministic mock analysis, seeded from the input so the same photo
 * always produces the same result during development/demoing. Swap for a
 * real CV engine by implementing OilAnalysisEngine with the same signature.
 */
export const mockEngine: OilAnalysisEngine = {
  async analyzeOilPaper(input: OilAnalysisInput): Promise<OilAnalysisResult> {
    await new Promise((resolve) => setTimeout(resolve, 400))

    const rand = seededRandom(hashString(input.imageUrl + input.capturedAt))

    const zoneScores: ZoneScore[] = FACE_ZONES.map((zone) => {
      const isTZone = zone === '이마' || zone === '코'
      const base = isTZone ? 45 + rand() * 45 : 20 + rand() * 45
      const oilCoverage = Math.round(base)
      const oilIntensity = Math.round(Math.min(100, Math.max(0, base + (rand() - 0.5) * 20)))
      return { zone, oilCoverage, oilIntensity, score: calcOilScore(oilCoverage, oilIntensity) }
    })

    const tZoneScores = zoneScores.filter((z) => z.zone === '이마' || z.zone === '코')
    const uZoneScores = zoneScores.filter((z) => z.zone !== '이마' && z.zone !== '코')
    const avg = (list: ZoneScore[]) => list.reduce((sum, z) => sum + z.score, 0) / list.length

    const tZoneScore = Math.round(avg(tZoneScores))
    const uZoneScore = Math.round(avg(uZoneScores))
    const oilCoverage = Math.round(zoneScores.reduce((sum, z) => sum + z.oilCoverage, 0) / zoneScores.length)
    const oilIntensity = Math.round(zoneScores.reduce((sum, z) => sum + z.oilIntensity, 0) / zoneScores.length)
    const oilScore = calcOilScore(oilCoverage, oilIntensity)
    const skinType = classifySkinType(oilScore)
    const skinCharacter = resolveSkinCharacter(skinType, tZoneScore, uZoneScore)

    return {
      oilCoverage,
      oilIntensity,
      tZoneScore,
      uZoneScore,
      oilScore,
      confidence: 0.7 + rand() * 0.25,
      skinType,
      skinCharacter,
      zoneScores,
    }
  },
}
