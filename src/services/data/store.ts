// Live-binding data store backing the app's products/measurements/routine-events.
// Populated from the D1-backed API at boot (see initData, gated in main.tsx) and
// kept in sync afterward via registerMeasurement() for newly created measurements.
import { createMeasurementApi, fetchMeasurements, fetchProducts, fetchRoutineEvents } from '../../lib/api'
import type { Measurement, OilAnalysisResult } from '../../types/measurement'
import type { Product, RoutineEvent } from '../../types/product'

const EMPTY_MEASUREMENT: Measurement = {
  id: 'measurement-none',
  userId: 'user-1',
  capturedAt: new Date(0).toISOString(),
  imageUrl: '',
  result: {
    oilCoverage: 0,
    oilIntensity: 0,
    spotDensity: 0,
    tZoneScore: 0,
    uZoneScore: 0,
    oilScore: 0,
    confidence: 0,
    skinType: '중성',
    skinCharacter: 'balance',
    zoneScores: [],
  },
}

export let mockProducts: Product[] = []
export let mockMeasurements: Measurement[] = []
export let mockRoutineEvents: RoutineEvent[] = []
export let mockLatestMeasurement: Measurement = EMPTY_MEASUREMENT

/** Among same-day measurements, the most recently captured one is representative; falls back to the latest overall. */
export function getRepresentativeMeasurement(measurements: Measurement[]): Measurement {
  if (measurements.length === 0) return EMPTY_MEASUREMENT
  const now = new Date()
  const isSameDay = (iso: string) => {
    const d = new Date(iso)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
  }
  const pool = measurements.filter((m) => isSameDay(m.capturedAt))
  const candidates = pool.length > 0 ? pool : measurements
  return candidates.reduce((latest, m) => (new Date(m.capturedAt) > new Date(latest.capturedAt) ? m : latest))
}

let initPromise: Promise<void> | null = null

/** Fetches products/measurements/routine-events from the API once and populates the module-level live bindings. */
export function initData(): Promise<void> {
  if (!initPromise) {
    initPromise = Promise.all([fetchProducts(), fetchMeasurements(), fetchRoutineEvents()]).then(
      ([products, measurements, routineEvents]) => {
        mockProducts = products
        mockMeasurements = measurements
        mockRoutineEvents = routineEvents
        mockLatestMeasurement = getRepresentativeMeasurement(measurements)
      },
    )
  }
  return initPromise
}

/** Persists a freshly analyzed measurement and updates the live bindings so it's visible on next render. */
export async function registerMeasurement(capturedAt: string, imageUrl: string, result: OilAnalysisResult): Promise<Measurement> {
  const created = await createMeasurementApi({ capturedAt, imageUrl, result })
  mockMeasurements = [...mockMeasurements, created]
  mockLatestMeasurement = getRepresentativeMeasurement(mockMeasurements)
  return created
}
