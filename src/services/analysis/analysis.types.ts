import type { OilAnalysisInput, OilAnalysisResult } from '../../types/measurement'

/**
 * Stable contract every analysis engine implements — mock today, a real CV/AI
 * pipeline later. Callers depend only on this interface, never on the engine.
 */
export interface OilAnalysisEngine {
  analyzeOilPaper(input: OilAnalysisInput): Promise<OilAnalysisResult>
}
