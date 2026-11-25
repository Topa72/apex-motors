import type { Config, Context } from '@netlify/functions'
import { randomUUID } from 'node:crypto'
import { PHOTO_KEY_PATTERN } from '../../shared/vehicle.ts'
import { isAdmin } from '../lib/auth.ts'
import { error, json, methodNotAllowed } from '../lib/http.ts'
import { photos } from '../lib/store.ts'

const TYPES: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }
const MAX_BYTES = 5 * 1024 * 1024

/**
 * POST   /api/photos       envoie une photo (corps = l'image), répond { key } (administrateur)
 * GET    /api/photos/:key  sert la photo, publique
 * DELETE /api/photos/:key  supprime une photo pas encore enregistrée dans une annonce (administrateur)
 */
export default async (req: Request, context: Pick<Context, 'params'>) => {
  const key = context.params?.key

  if (!key) {
    if (req.method !== 'POST') return methodNotAllowed(['POST'])
    if (!isAdmin(req)) return error(401, 'Connectez-vous pour envoyer des photos.')
    const contentType = (req.headers.get('content-type') ?? '').split(';')[0].trim()
    const ext = TYPES[contentType]
    if (!ext) return error(415, 'Format accepté : JPEG, PNG ou WebP.')
    const data = await req.arrayBuffer()
    if (data.byteLength === 0) return error(400, 'La photo est vide.')
    if (data.byteLength > MAX_BYTES) return error(413, 'Photo trop lourde (5 Mo maximum).')
    const newKey = `${randomUUID()}.${ext}`
    await photos().set(newKey, data, { metadata: { contentType } })
    return json({ key: newKey }, 201)
  }

  if (!PHOTO_KEY_PATTERN.test(key)) return error(404, 'Photo introuvable.')

  if (req.method === 'DELETE') {
    if (!isAdmin(req)) return error(401, 'Connectez-vous pour supprimer des photos.')
    await photos().delete(key)
    return json({ deleted: key })
  }

  if (req.method !== 'GET') return methodNotAllowed(['GET', 'DELETE'])
  const blob = await photos().getWithMetadata(key, { type: 'arrayBuffer' })
  if (!blob) return error(404, 'Photo introuvable.')
  const contentType = typeof blob.metadata.contentType === 'string' ? blob.metadata.contentType : 'image/jpeg'
  return new Response(blob.data, {
    headers: {
      'Content-Type': contentType,
      // Chaque photo a une clé unique et ne change jamais.
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}

export const config: Config = { path: ['/api/photos', '/api/photos/:key'] }
