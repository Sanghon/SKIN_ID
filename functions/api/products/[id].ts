import { json, notFound, toProductDTO } from '../../_shared'
import type { Env, ProductRow } from '../../_shared'

interface PatchBody {
  name?: string
  brand?: string
  step?: string
  price?: number
  imageUrl?: string
  description?: string
  matchScore?: number
  reason?: string
}

export const onRequestPatch: PagesFunction<Env> = async ({ request, env, params }) => {
  const id = String(params.id)
  const existing = await env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(id).first<ProductRow>()
  if (!existing) return notFound('Product not found')

  const body = (await request.json()) as PatchBody
  const next: ProductRow = {
    id: existing.id,
    name: body.name ?? existing.name,
    brand: body.brand ?? existing.brand,
    step: body.step ?? existing.step,
    price: body.price ?? existing.price,
    image_url: body.imageUrl ?? existing.image_url,
    description: body.description ?? existing.description,
    match_score: body.matchScore ?? existing.match_score,
    reason: body.reason ?? existing.reason,
  }

  await env.DB.prepare(
    `UPDATE products SET name = ?, brand = ?, step = ?, price = ?, image_url = ?, description = ?, match_score = ?, reason = ?
     WHERE id = ?`,
  )
    .bind(next.name, next.brand, next.step, next.price, next.image_url, next.description, next.match_score, next.reason, id)
    .run()

  return json(toProductDTO(next))
}

export const onRequestDelete: PagesFunction<Env> = async ({ env, params }) => {
  const id = String(params.id)
  await env.DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run()
  return json({ ok: true })
}
