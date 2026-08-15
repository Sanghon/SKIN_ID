import { notFound } from '../../_shared'
import type { Env } from '../../_shared'

export const onRequestGet: PagesFunction<Env> = async ({ env, params }) => {
  const segments = Array.isArray(params.path) ? params.path : params.path ? [params.path] : []
  const key = segments.join('/')
  if (!key) return notFound('Image not found')

  const object = await env.BUCKET.get(key)
  if (!object) return notFound('Image not found')

  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set('etag', object.httpEtag)
  headers.set('cache-control', 'public, max-age=31536000, immutable')

  return new Response(object.body, { headers })
}
