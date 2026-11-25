import { getStore } from '@netlify/blobs'
import type { Vehicle } from '../../shared/vehicle.ts'

// Lecture « strong » : une annonce ajoutée est visible tout de suite, sans délai de propagation.
const inventory = () => getStore({ name: 'inventory', consistency: 'strong' })
export const photos = () => getStore({ name: 'photos', consistency: 'strong' })

const KEY = 'vehicles'

export async function readVehicles(): Promise<Vehicle[]> {
  const data = (await inventory().get(KEY, { type: 'json' })) as { vehicles?: Vehicle[] } | null
  return data?.vehicles ?? []
}

export async function writeVehicles(vehicles: Vehicle[]) {
  await inventory().setJSON(KEY, { vehicles })
}

export async function deletePhotos(keys: string[]) {
  const store = photos()
  await Promise.all(keys.map((k) => store.delete(k)))
}
