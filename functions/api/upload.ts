import { badRequest, json } from '../_shared'
import type { Env } from '../_shared'

const EXT_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const form = await request.formData()
  const file = form.get('file')
  const folder = String(form.get('folder') ?? 'misc').replace(/[^a-z0-9-]/gi, '') || 'misc'

  if (!(file instanceof File)) return badRequest('file is required')

  const ext = EXT_BY_MIME[file.type] ?? 'jpg'
  const key = `${folder}/${crypto.randomUUID()}.${ext}`

  await env.BUCKET.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type || 'application/octet-stream' },
  })

  return json({ url: `/api/images/${key}` }, { status: 201 })
}
