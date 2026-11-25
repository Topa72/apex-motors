import type { FieldErrors, Vehicle, VehicleInput } from '../../shared/vehicle.ts'

/** Erreur renvoyée par l'API, avec le détail par champ quand le formulaire est à corriger. */
export class ApiError extends Error {
  status: number
  fields?: FieldErrors
  constructor(status: number, message: string, fields?: FieldErrors) {
    super(message)
    this.status = status
    this.fields = fields
  }
}

/** L'API n'existe pas ici (aperçu sans Netlify) : la réponse n'est pas du JSON de l'API. */
export class ApiUnavailableError extends Error {}

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  let res: Response
  try {
    res = await fetch(path, { credentials: 'same-origin', ...init })
  } catch {
    throw new ApiUnavailableError('Connexion impossible.')
  }
  const isJson = res.headers.get('content-type')?.includes('application/json')
  if (!isJson) {
    if (res.status === 404 || res.ok) throw new ApiUnavailableError('API absente.')
    throw new ApiError(res.status, 'Le serveur ne répond pas correctement. Réessayez dans un instant.')
  }
  const body = (await res.json()) as T & { error?: string; fields?: FieldErrors }
  if (!res.ok) throw new ApiError(res.status, body.error ?? 'Une erreur est survenue.', body.fields)
  return body
}

const jsonInit = (method: string, body: unknown): RequestInit => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})

export const api = {
  listVehicles: () => call<{ vehicles: Vehicle[] }>('/api/vehicles').then((r) => r.vehicles),
  session: () => call<{ admin: boolean; configured: boolean }>('/api/session'),
  login: (password: string) => call<{ admin: boolean }>('/api/login', jsonInit('POST', { password })),
  logout: () => call<{ admin: boolean }>('/api/logout', { method: 'POST' }),
  createVehicle: (input: VehicleInput) =>
    call<{ vehicle: Vehicle }>('/api/vehicles', jsonInit('POST', input)).then((r) => r.vehicle),
  updateVehicle: (id: string, input: VehicleInput) =>
    call<{ vehicle: Vehicle }>(`/api/vehicles/${encodeURIComponent(id)}`, jsonInit('PUT', input)).then((r) => r.vehicle),
  deleteVehicle: (id: string) => call<{ deleted: string }>(`/api/vehicles/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  uploadPhoto: (image: Blob) =>
    call<{ key: string }>('/api/photos', { method: 'POST', headers: { 'Content-Type': image.type }, body: image }).then(
      (r) => r.key,
    ),
  deletePhoto: (key: string) => call<{ deleted: string }>(`/api/photos/${encodeURIComponent(key)}`, { method: 'DELETE' }),
}

export const photoUrl = (key: string) => `/api/photos/${encodeURIComponent(key)}`
