import { json } from '../../_shared'
import type { Env } from '../../_shared'

export const onRequestDelete: PagesFunction<Env> = async ({ env, params }) => {
  const id = String(params.id)
  await env.DB.prepare('DELETE FROM guideline_images WHERE id = ?').bind(id).run()
  return json({ ok: true })
}
