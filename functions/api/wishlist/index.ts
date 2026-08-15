import { json } from '../../_shared'
import type { Env } from '../../_shared'

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const { results } = await env.DB.prepare('SELECT product_id FROM wishlist ORDER BY created_at ASC').all<{
    product_id: string
  }>()
  return json(results.map((r) => r.product_id))
}
