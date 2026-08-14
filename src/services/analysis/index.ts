import { mockEngine } from './mockEngine'
import type { OilAnalysisEngine } from './analysis.types'

// Single swap point: replace with the real CV engine once it exists.
export const analysisEngine: OilAnalysisEngine = mockEngine

export type { OilAnalysisEngine } from './analysis.types'
