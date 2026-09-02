import { opticalEngine } from './opticalEngine'
import type { OilAnalysisEngine } from './analysis.types'

// Single swap point: browser optical PoC today, OpenCV/server engine later.
export const analysisEngine: OilAnalysisEngine = opticalEngine

export type { OilAnalysisEngine } from './analysis.types'
