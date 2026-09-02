import { badRequest, json, newId, toMeasurementDTO } from '../../_shared'
import type { Env, MeasurementRow, ZoneScoreRow } from '../../_shared'

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const [{ results: measurements }, { results: zoneScores }] = await Promise.all([
    env.DB.prepare('SELECT * FROM measurements ORDER BY captured_at ASC').all<MeasurementRow>(),
    env.DB.prepare('SELECT * FROM zone_scores').all<ZoneScoreRow>(),
  ])

  const zoneScoresByMeasurement = new Map<string, ZoneScoreRow[]>()
  for (const z of zoneScores) {
    const list = zoneScoresByMeasurement.get(z.measurement_id) ?? []
    list.push(z)
    zoneScoresByMeasurement.set(z.measurement_id, list)
  }

  return json(measurements.map((m) => toMeasurementDTO(m, zoneScoresByMeasurement.get(m.id) ?? [])))
}

interface ZoneScoreInput {
  zone: string
  oilCoverage: number
  oilIntensity: number
  score: number
}

interface CreateBody {
  capturedAt: string
  imageUrl?: string
  userId?: string
  result: {
    oilCoverage: number
    oilIntensity: number
    spotDensity?: number
    tZoneScore: number
    uZoneScore: number
    oilScore: number
    confidence: number
    skinType: string
    skinCharacter: string
    zoneScores: ZoneScoreInput[]
  }
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const body = (await request.json()) as CreateBody
  if (!body.capturedAt || !body.result) return badRequest('capturedAt and result are required')

  const id = newId('measurement')
  const r = body.result

  await env.DB.prepare(
    `INSERT INTO measurements
       (id, user_id, captured_at, image_url, oil_coverage, oil_intensity, spot_density, t_zone_score, u_zone_score, oil_score, confidence, skin_type, skin_character)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      id,
      body.userId ?? 'user-1',
      body.capturedAt,
      body.imageUrl ?? '',
      r.oilCoverage,
      r.oilIntensity,
      r.spotDensity ?? 0,
      r.tZoneScore,
      r.uZoneScore,
      r.oilScore,
      r.confidence,
      r.skinType,
      r.skinCharacter,
    )
    .run()

  const zoneInserts = r.zoneScores.map((z) =>
    env.DB.prepare(
      'INSERT INTO zone_scores (measurement_id, zone, oil_coverage, oil_intensity, score) VALUES (?, ?, ?, ?, ?)',
    ).bind(id, z.zone, z.oilCoverage, z.oilIntensity, z.score),
  )
  if (zoneInserts.length > 0) await env.DB.batch(zoneInserts)

  const row = await env.DB.prepare('SELECT * FROM measurements WHERE id = ?').bind(id).first<MeasurementRow>()
  const { results: zoneScores } = await env.DB.prepare('SELECT * FROM zone_scores WHERE measurement_id = ?')
    .bind(id)
    .all<ZoneScoreRow>()

  return json(toMeasurementDTO(row!, zoneScores), { status: 201 })
}
