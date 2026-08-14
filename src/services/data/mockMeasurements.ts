import { calcOilScore, classifySkinType, resolveSkinCharacter } from '../../lib/oilIndex'
import { FACE_ZONES } from '../../types/measurement'
import type { Measurement } from '../../types/measurement'
import type { ZoneScore } from '../../types/skin'
import { mockCurrentUser } from './mockUsers'

function buildZoneScores(dayIndex: number): ZoneScore[] {
  return FACE_ZONES.map((zone, zoneIndex) => {
    const isTZone = zone === '이마' || zone === '코'
    const wobble = Math.sin(dayIndex * 0.7 + zoneIndex) * 10
    const trend = 55 - dayIndex * 1.4
    const base = (isTZone ? trend + 12 : trend - 8) + wobble
    const oilCoverage = Math.round(Math.min(100, Math.max(5, base)))
    const oilIntensity = Math.round(Math.min(100, Math.max(5, base - 6 + wobble * 0.3)))
    return { zone, oilCoverage, oilIntensity, score: calcOilScore(oilCoverage, oilIntensity) }
  })
}

function buildMeasurement(daysAgo: number, id: string, capturedAt: string, wobbleOffset = 0): Measurement {
  const zoneScores = buildZoneScores(daysAgo + wobbleOffset)
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
    id,
    userId: mockCurrentUser.id,
    capturedAt,
    imageUrl: '',
    result: {
      oilCoverage,
      oilIntensity,
      tZoneScore,
      uZoneScore,
      oilScore,
      confidence: 0.85,
      skinType,
      skinCharacter,
      zoneScores,
    },
  }
}

function daysAgoIso(daysAgo: number): string {
  return new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString()
}

function todayAt(hour: number): string {
  const d = new Date()
  d.setHours(hour, 0, 0, 0)
  return d.toISOString()
}

// Chronological order: oldest first, most recent last (convenient for history graphs).
// Today gets two entries (morning + evening) to model re-measuring within the same day —
// the later one is the day's representative result (see getRepresentativeMeasurement below).
export const mockMeasurements: Measurement[] = [
  ...Array.from({ length: 13 }, (_, i) => buildMeasurement(13 - i, `measurement-${13 - i}`, daysAgoIso(13 - i))),
  buildMeasurement(0, 'measurement-0-am', todayAt(9)),
  buildMeasurement(0, 'measurement-0-pm', todayAt(21), -0.6),
]

/** Among same-day measurements, the most recently captured one is representative; falls back to the latest overall. */
export function getRepresentativeMeasurement(measurements: Measurement[]): Measurement {
  const now = new Date()
  const isSameDay = (iso: string) => {
    const d = new Date(iso)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
  }
  const pool = measurements.filter((m) => isSameDay(m.capturedAt))
  const candidates = pool.length > 0 ? pool : measurements
  return candidates.reduce((latest, m) => (new Date(m.capturedAt) > new Date(latest.capturedAt) ? m : latest))
}

export const mockLatestMeasurement = getRepresentativeMeasurement(mockMeasurements)
