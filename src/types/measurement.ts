import type { FaceZone, SkinCharacterId, SkinType, ZoneScore } from './skin'

export interface OilAnalysisInput {
  imageUrl: string
  capturedAt: string
  roi?: NormalizedRoi
}

export interface NormalizedRoi {
  x: number
  y: number
  width: number
  height: number
}

export interface OilAnalysisResult {
  oilCoverage: number
  oilIntensity: number
  spotDensity?: number
  tZoneScore: number
  uZoneScore: number
  oilScore: number
  confidence: number
  skinType: SkinType
  skinCharacter: SkinCharacterId
  zoneScores: ZoneScore[]
}

export interface Measurement {
  id: string
  userId: string
  capturedAt: string
  imageUrl: string
  result: OilAnalysisResult
}

export interface MeasurementDelta {
  oilScoreDelta: number
  vsAverageDelta: number
}

export const FACE_ZONES: FaceZone[] = ['이마', '코', '왼쪽볼', '오른쪽볼', '턱']
