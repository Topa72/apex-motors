/**
 * Format d'une annonce, partagé entre le site, la page d'administration et les fonctions Netlify.
 * Toute donnée qui arrive du formulaire passe par validateVehicleInput avant d'être enregistrée.
 */

export const VEHICLE_TYPES = ['Citadine', 'Berline', 'SUV', 'Familiale', 'Électrique', 'Utilitaire'] as const
export type VehicleType = (typeof VEHICLE_TYPES)[number]

export const FUELS = ['Essence', 'Diesel', 'Hybride', 'Hybride rechargeable', 'Électrique', 'GPL'] as const
export type Fuel = (typeof FUELS)[number]

export const GEARBOXES = ['Manuelle', 'Automatique'] as const
export type Gearbox = (typeof GEARBOXES)[number]

/** Vignette Crit'Air : 0 (électrique) à 5, null = non classé. */
export const CRIT_AIR_VALUES = [0, 1, 2, 3, 4, 5] as const
export type CritAir = (typeof CRIT_AIR_VALUES)[number] | null

export const WARRANTY_MONTHS = [3, 6, 12, 24] as const

/** Proposées dans le formulaire ; toute autre marque peut être saisie. */
export const MAKE_SUGGESTIONS = [
  'Citroën',
  'DS',
  'Peugeot',
  'Opel',
  'Fiat',
  'Renault',
  'Dacia',
  'Volkswagen',
  'Toyota',
  'Ford',
  'Nissan',
  'Skoda',
  'Seat',
  'Kia',
  'Hyundai',
]

export const MAX_PHOTOS = 12
export const PHOTO_KEY_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$/

export interface VehicleInput {
  make: string
  model: string
  version: string
  year: number
  km: number
  fuel: Fuel
  gearbox: Gearbox
  type: VehicleType
  critAir: CritAir
  warrantyMonths: number
  price: number
  /** Clés des photos dans le stockage, la première est la photo principale. */
  photos: string[]
}

export interface Vehicle extends VehicleInput {
  id: string
  createdAt: string
  updatedAt: string
}

export type FieldErrors = Partial<Record<keyof VehicleInput, string>>

export type ValidationResult = { ok: true; value: VehicleInput } | { ok: false; errors: FieldErrors }

const text = (v: unknown) => (typeof v === 'string' ? v.trim().replace(/\s+/g, ' ') : '')

/** Accepte « 12 400 », « 12400 » ou 12400. */
const integer = (v: unknown): number | null => {
  if (typeof v === 'number') return Number.isInteger(v) ? v : null
  if (typeof v !== 'string') return null
  const cleaned = v.replace(/[\s  .]/g, '')
  return /^\d+$/.test(cleaned) ? Number(cleaned) : null
}

const oneOf = <T extends string>(list: readonly T[], v: unknown): T | null =>
  list.includes(v as T) ? (v as T) : null

export function validateVehicleInput(raw: unknown): ValidationResult {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  const errors: FieldErrors = {}
  const maxYear = new Date().getFullYear() + 1

  const make = text(r.make)
  if (!make) errors.make = 'Indiquez la marque.'
  else if (make.length > 40) errors.make = '40 caractères maximum.'

  const model = text(r.model)
  if (!model) errors.model = 'Indiquez le modèle.'
  else if (model.length > 60) errors.model = '60 caractères maximum.'

  const version = text(r.version)
  if (version.length > 80) errors.version = '80 caractères maximum.'

  const year = integer(r.year)
  if (year === null || year < 1950 || year > maxYear) errors.year = `Année entre 1950 et ${maxYear}.`

  const km = integer(r.km)
  if (km === null || km > 999_999) errors.km = 'Kilométrage en chiffres, sans « km ».'

  const fuel = oneOf(FUELS, r.fuel)
  if (!fuel) errors.fuel = 'Choisissez le carburant.'

  const gearbox = oneOf(GEARBOXES, r.gearbox)
  if (!gearbox) errors.gearbox = 'Choisissez la boîte de vitesses.'

  const type = oneOf(VEHICLE_TYPES, r.type)
  if (!type) errors.type = 'Choisissez le type de véhicule.'

  let critAir: CritAir = null
  if (r.critAir !== null && r.critAir !== '' && r.critAir !== undefined) {
    const n = integer(r.critAir)
    if (n === null || !CRIT_AIR_VALUES.includes(n as (typeof CRIT_AIR_VALUES)[number])) {
      errors.critAir = 'Vignette Crit’Air invalide.'
    } else critAir = n as CritAir
  }

  const warrantyMonths = integer(r.warrantyMonths)
  if (warrantyMonths === null || warrantyMonths < 0 || warrantyMonths > 60) {
    errors.warrantyMonths = 'Choisissez la durée de garantie.'
  }

  const price = integer(r.price)
  if (price === null || price < 100 || price > 500_000) errors.price = 'Prix en euros, sans « € ».'

  const photos = Array.isArray(r.photos) ? r.photos : []
  if (photos.length > MAX_PHOTOS) errors.photos = `${MAX_PHOTOS} photos maximum.`
  else if (!photos.every((p) => typeof p === 'string' && PHOTO_KEY_PATTERN.test(p))) {
    errors.photos = 'Photo invalide, rechargez-la.'
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors }
  return {
    ok: true,
    value: {
      make,
      model,
      version,
      year: year!,
      km: km!,
      fuel: fuel!,
      gearbox: gearbox!,
      type: type!,
      critAir,
      warrantyMonths: warrantyMonths!,
      price: price!,
      photos: [...new Set(photos as string[])],
    },
  }
}
