export interface Env {
  DB: D1Database
  BUCKET: R2Bucket
}

export function json(data: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { 'content-type': 'application/json; charset=utf-8', ...init?.headers },
  })
}

export function badRequest(message: string): Response {
  return json({ error: message }, { status: 400 })
}

export function notFound(message = 'Not found'): Response {
  return json({ error: message }, { status: 404 })
}

export function newId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`
}

export interface ProductRow {
  id: string
  name: string
  brand: string
  step: string
  price: number
  image_url: string
  description: string
  match_score: number
  reason: string
}

export interface ProductDTO {
  id: string
  name: string
  brand: string
  step: string
  price: number
  imageUrl: string
  description: string
  matchScore: number
  reason: string
}

export function toProductDTO(row: ProductRow): ProductDTO {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    step: row.step,
    price: row.price,
    imageUrl: row.image_url,
    description: row.description,
    matchScore: row.match_score,
    reason: row.reason,
  }
}

export interface ZoneScoreRow {
  measurement_id: string
  zone: string
  oil_coverage: number
  oil_intensity: number
  score: number
}

export interface MeasurementRow {
  id: string
  user_id: string
  captured_at: string
  image_url: string
  oil_coverage: number
  oil_intensity: number
  t_zone_score: number
  u_zone_score: number
  oil_score: number
  confidence: number
  skin_type: string
  skin_character: string
}

export function toMeasurementDTO(row: MeasurementRow, zoneScores: ZoneScoreRow[]) {
  return {
    id: row.id,
    userId: row.user_id,
    capturedAt: row.captured_at,
    imageUrl: row.image_url,
    result: {
      oilCoverage: row.oil_coverage,
      oilIntensity: row.oil_intensity,
      tZoneScore: row.t_zone_score,
      uZoneScore: row.u_zone_score,
      oilScore: row.oil_score,
      confidence: row.confidence,
      skinType: row.skin_type,
      skinCharacter: row.skin_character,
      zoneScores: zoneScores.map((z) => ({
        zone: z.zone,
        oilCoverage: z.oil_coverage,
        oilIntensity: z.oil_intensity,
        score: z.score,
      })),
    },
  }
}

export interface RoutineEventRow {
  id: string
  measurement_id: string
  product_id: string
  note: string
}

export function toRoutineEventDTO(row: RoutineEventRow) {
  return { id: row.id, measurementId: row.measurement_id, productId: row.product_id, note: row.note }
}

export interface GuidelineImageRow {
  id: string
  image_url: string
  position: number
}
