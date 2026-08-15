import { badRequest, json, newId } from '../../_shared'
import type { Env, GuidelineImageRow } from '../../_shared'

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const { results } = await env.DB.prepare('SELECT * FROM guideline_images ORDER BY position ASC').all<GuidelineImageRow>()
  return json(results.map((r) => ({ id: r.id, imageUrl: r.image_url, position: r.position })))
}

interface CreateBody {
  imageUrl: string
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const body = (await request.json()) as CreateBody
  if (!body.imageUrl?.trim()) return badRequest('imageUrl is required')

  const { count } = (await env.DB.prepare('SELECT COUNT(*) as count FROM guideline_images').first<{
    count: number
  }>())!

  const id = newId('guideline')
  await env.DB.prepare('INSERT INTO guideline_images (id, image_url, position) VALUES (?, ?, ?)')
    .bind(id, body.imageUrl, count)
    .run()

  return json({ id, imageUrl: body.imageUrl, position: count }, { status: 201 })
}
