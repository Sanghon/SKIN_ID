import { badRequest, json } from '../../_shared'
import type { Env } from '../../_shared'

const KEY = 'hero_photo_url'

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const row = await env.DB.prepare('SELECT value FROM app_settings WHERE key = ?').bind(KEY).first<{
    value: string
  }>()
  return json({ url: row?.value ?? '' })
}

interface PutBody {
  url: string
}

export const onRequestPut: PagesFunction<Env> = async ({ request, env }) => {
  const body = (await request.json()) as PutBody
  if (typeof body.url !== 'string') return badRequest('url is required')

  await env.DB.prepare('INSERT INTO app_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value')
    .bind(KEY, body.url)
    .run()

  return json({ url: body.url })
}
