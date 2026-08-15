import { badRequest, json, newId, toProductDTO } from '../../_shared'
import type { Env, ProductRow } from '../../_shared'

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const { results } = await env.DB.prepare('SELECT * FROM products ORDER BY created_at ASC').all<ProductRow>()
  return json(results.map(toProductDTO))
}

interface CreateBody {
  id?: string
  name: string
  brand: string
  step: string
  price: number
  imageUrl?: string
  description?: string
  matchScore?: number
  reason?: string
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const body = (await request.json()) as CreateBody
  if (!body.name?.trim()) return badRequest('name is required')

  const id = body.id?.trim() || newId('product')
  await env.DB.prepare(
    `INSERT INTO products (id, name, brand, step, price, image_url, description, match_score, reason)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      id,
      body.name,
      body.brand ?? '',
      body.step ?? 'cleansing',
      body.price ?? 0,
      body.imageUrl ?? '',
      body.description ?? '',
      body.matchScore ?? 0,
      body.reason ?? '',
    )
    .run()

  const row = await env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(id).first<ProductRow>()
  return json(toProductDTO(row!), { status: 201 })
}
