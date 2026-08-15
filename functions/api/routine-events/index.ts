import { badRequest, json, newId, toRoutineEventDTO } from '../../_shared'
import type { Env, RoutineEventRow } from '../../_shared'

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const { results } = await env.DB.prepare('SELECT * FROM routine_events ORDER BY created_at ASC').all<RoutineEventRow>()
  return json(results.map(toRoutineEventDTO))
}

interface CreateBody {
  id?: string
  measurementId: string
  productId: string
  note?: string
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const body = (await request.json()) as CreateBody
  if (!body.measurementId || !body.productId) return badRequest('measurementId and productId are required')

  const id = body.id?.trim() || newId('routine')
  await env.DB.prepare('INSERT INTO routine_events (id, measurement_id, product_id, note) VALUES (?, ?, ?, ?)')
    .bind(id, body.measurementId, body.productId, body.note ?? '')
    .run()

  const row = await env.DB.prepare('SELECT * FROM routine_events WHERE id = ?').bind(id).first<RoutineEventRow>()
  return json(toRoutineEventDTO(row!), { status: 201 })
}
