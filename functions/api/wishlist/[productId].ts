import { json } from '../../_shared'
import type { Env } from '../../_shared'

export const onRequestPost: PagesFunction<Env> = async ({ env, params }) => {
  const productId = String(params.productId)
  await env.DB.prepare('INSERT OR IGNORE INTO wishlist (product_id) VALUES (?)').bind(productId).run()
  return json({ ok: true })
}

export const onRequestDelete: PagesFunction<Env> = async ({ env, params }) => {
  const productId = String(params.productId)
  await env.DB.prepare('DELETE FROM wishlist WHERE product_id = ?').bind(productId).run()
  return json({ ok: true })
}
