import type { Config, Context } from '@netlify/functions'
import { randomUUID } from 'node:crypto'
import { validateVehicleInput, type Vehicle } from '../../shared/vehicle.ts'
import { isAdmin } from '../lib/auth.ts'
import { error, json, methodNotAllowed, readJson } from '../lib/http.ts'
import { deletePhotos, readVehicles, writeVehicles } from '../lib/store.ts'

/**
 * GET    /api/vehicles      liste publique, la plus récente en premier
 * POST   /api/vehicles      ajoute une annonce (administrateur)
 * PUT    /api/vehicles/:id  modifie une annonce (administrateur)
 * DELETE /api/vehicles/:id  supprime une annonce et ses photos (administrateur)
 */
export default async (req: Request, context: Pick<Context, 'params'>) => {
  const id = context.params?.id

  if (!id) {
    if (req.method === 'GET') {
      const vehicles = await readVehicles()
      return json({ vehicles })
    }
    if (req.method !== 'POST') return methodNotAllowed(['GET', 'POST'])
    if (!isAdmin(req)) return error(401, 'Connectez-vous pour ajouter un véhicule.')

    const result = validateVehicleInput(await readJson(req))
    if (!result.ok) return json({ error: 'Certains champs sont à corriger.', fields: result.errors }, 422)

    const now = new Date().toISOString()
    const vehicle: Vehicle = { ...result.value, id: randomUUID(), createdAt: now, updatedAt: now }
    const vehicles = await readVehicles()
    await writeVehicles([vehicle, ...vehicles])
    return json({ vehicle }, 201)
  }

  if (req.method !== 'PUT' && req.method !== 'DELETE') return methodNotAllowed(['PUT', 'DELETE'])
  if (!isAdmin(req)) return error(401, 'Connectez-vous pour modifier les annonces.')

  const vehicles = await readVehicles()
  const index = vehicles.findIndex((v) => v.id === id)
  if (index === -1) return error(404, 'Cette annonce n’existe plus.')
  const current = vehicles[index]

  if (req.method === 'DELETE') {
    await writeVehicles(vehicles.filter((v) => v.id !== id))
    await deletePhotos(current.photos)
    return json({ deleted: id })
  }

  const result = validateVehicleInput(await readJson(req))
  if (!result.ok) return json({ error: 'Certains champs sont à corriger.', fields: result.errors }, 422)

  const updated: Vehicle = { ...current, ...result.value, updatedAt: new Date().toISOString() }
  const next = [...vehicles]
  next[index] = updated
  await writeVehicles(next)
  // Les photos retirées de l'annonce ne servent plus : on libère la place.
  await deletePhotos(current.photos.filter((p) => !updated.photos.includes(p)))
  return json({ vehicle: updated })
}

export const config: Config = { path: ['/api/vehicles', '/api/vehicles/:id'] }
