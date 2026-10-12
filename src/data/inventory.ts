import { LISTING_APR, LISTING_TERM, monthlyPayment } from '@/lib/utils'

export const VEHICLE_TYPES = ['Citadine', 'Berline', 'SUV', 'Familiale', 'Électrique', 'Utilitaire'] as const
export type VehicleType = (typeof VEHICLE_TYPES)[number]

export const MAKES = ['Citroën', 'Dacia', 'Peugeot', 'Renault', 'Toyota', 'Volkswagen'] as const
export type Make = (typeof MAKES)[number]

export type Fuel = 'Essence' | 'Diesel' | 'Hybride' | 'Hybride rechargeable' | 'Électrique'
export type Gearbox = 'Manuelle' | 'Automatique'

export interface Vehicle {
  id: string
  year: number
  make: Make
  model: string
  version: string
  type: VehicleType
  km: number
  fuel: Fuel
  gearbox: Gearbox
  /** Vignette Crit'Air (0 = véhicule électrique). */
  critAir: 0 | 1 | 2
  warrantyMonths: number
  price: number
}

export const vehicleName = (v: Vehicle) => `${v.make} ${v.model}`

/** Mensualité indicative sur 60 mois, sans apport. */
export const vehicleMonthly = (v: Vehicle) => monthlyPayment(v.price, LISTING_APR, LISTING_TERM)

/** Les neuf premiers forment la grille affichée ; les suivants arrivent avec « Voir plus ». */
export const inventory: Vehicle[] = [
  { id: 'c3-2022', year: 2022, make: 'Citroën', model: 'C3', version: '1.2 PureTech 83 Feel Pack', type: 'Citadine', km: 28400, fuel: 'Essence', gearbox: 'Manuelle', critAir: 1, warrantyMonths: 12, price: 13990 },
  { id: 'c3-aircross-2021', year: 2021, make: 'Citroën', model: 'C3 Aircross', version: '1.2 PureTech 110 Shine', type: 'SUV', km: 41200, fuel: 'Essence', gearbox: 'Manuelle', critAir: 1, warrantyMonths: 12, price: 16490 },
  { id: 'c5-aircross-2021', year: 2021, make: 'Citroën', model: 'C5 Aircross', version: '1.5 BlueHDi 130 EAT8 Feel', type: 'SUV', km: 63800, fuel: 'Diesel', gearbox: 'Automatique', critAir: 2, warrantyMonths: 12, price: 22900 },
  { id: 'e-c4-2022', year: 2022, make: 'Citroën', model: 'ë-C4', version: '136 ch Shine', type: 'Électrique', km: 19600, fuel: 'Électrique', gearbox: 'Automatique', critAir: 0, warrantyMonths: 24, price: 21490 },
  { id: 'c4-2023', year: 2023, make: 'Citroën', model: 'C4', version: '1.2 PureTech 130 EAT8 Shine', type: 'Berline', km: 12300, fuel: 'Essence', gearbox: 'Automatique', critAir: 1, warrantyMonths: 24, price: 23990 },
  { id: 'berlingo-2020', year: 2020, make: 'Citroën', model: 'Berlingo', version: '1.5 BlueHDi 130 Shine M', type: 'Familiale', km: 74500, fuel: 'Diesel', gearbox: 'Manuelle', critAir: 2, warrantyMonths: 12, price: 18900 },
  { id: 'c5-x-2023', year: 2023, make: 'Citroën', model: 'C5 X', version: 'Hybride rechargeable 225 ë-EAT8', type: 'Berline', km: 9800, fuel: 'Hybride rechargeable', gearbox: 'Automatique', critAir: 1, warrantyMonths: 24, price: 34900 },
  { id: 'peugeot-208-2021', year: 2021, make: 'Peugeot', model: '208', version: '1.2 PureTech 100 Allure', type: 'Citadine', km: 33900, fuel: 'Essence', gearbox: 'Manuelle', critAir: 1, warrantyMonths: 12, price: 14990 },
  { id: 'jumpy-2021', year: 2021, make: 'Citroën', model: 'Jumpy Fourgon', version: 'M 2.0 BlueHDi 145 Club', type: 'Utilitaire', km: 88000, fuel: 'Diesel', gearbox: 'Manuelle', critAir: 2, warrantyMonths: 12, price: 21900 },
  { id: 'e-c3-2024', year: 2024, make: 'Citroën', model: 'ë-C3', version: '113 ch Max', type: 'Électrique', km: 4200, fuel: 'Électrique', gearbox: 'Automatique', critAir: 0, warrantyMonths: 24, price: 21990 },
  { id: 'clio-2022', year: 2022, make: 'Renault', model: 'Clio V', version: 'TCe 90 Evolution', type: 'Citadine', km: 24700, fuel: 'Essence', gearbox: 'Manuelle', critAir: 1, warrantyMonths: 12, price: 14490 },
  { id: 'sandero-2022', year: 2022, make: 'Dacia', model: 'Sandero Stepway', version: 'TCe 90 Confort', type: 'Citadine', km: 31200, fuel: 'Essence', gearbox: 'Manuelle', critAir: 1, warrantyMonths: 12, price: 12900 },
  { id: 'peugeot-3008-2020', year: 2020, make: 'Peugeot', model: '3008', version: '1.5 BlueHDi 130 EAT8 Allure', type: 'SUV', km: 69300, fuel: 'Diesel', gearbox: 'Automatique', critAir: 2, warrantyMonths: 12, price: 21490 },
  { id: 'c1-2019', year: 2019, make: 'Citroën', model: 'C1', version: '1.0 VTi 72 Feel', type: 'Citadine', km: 52100, fuel: 'Essence', gearbox: 'Manuelle', critAir: 1, warrantyMonths: 12, price: 8490 },
  { id: 'golf-2021', year: 2021, make: 'Volkswagen', model: 'Golf 8', version: '1.5 TSI 130 Life', type: 'Berline', km: 45600, fuel: 'Essence', gearbox: 'Manuelle', critAir: 1, warrantyMonths: 12, price: 19990 },
  { id: 'yaris-2021', year: 2021, make: 'Toyota', model: 'Yaris', version: 'Hybride 116 Design', type: 'Citadine', km: 38100, fuel: 'Hybride', gearbox: 'Automatique', critAir: 1, warrantyMonths: 12, price: 17490 },
  { id: 'grand-c4-spacetourer-2019', year: 2019, make: 'Citroën', model: 'Grand C4 SpaceTourer', version: '1.5 BlueHDi 130 7 places', type: 'Familiale', km: 81400, fuel: 'Diesel', gearbox: 'Manuelle', critAir: 2, warrantyMonths: 12, price: 15990 },
  { id: 'ami-2023', year: 2023, make: 'Citroën', model: 'Ami', version: '100 % électrique', type: 'Électrique', km: 3100, fuel: 'Électrique', gearbox: 'Automatique', critAir: 0, warrantyMonths: 24, price: 7490 },
]

export interface InventoryFilters {
  type: 'Tous' | VehicleType
  make: 'Toutes' | Make
  maxPrice: number
  /** Renseigné par la recherche rapide ; null = pas de plafond. */
  maxMonthly: number | null
  /** Recherche libre sur le modèle, depuis la recherche rapide. */
  model: string
}

export const PRICE_MIN = 5000
export const PRICE_MAX = 40000

export const defaultFilters: InventoryFilters = {
  type: 'Tous',
  make: 'Toutes',
  maxPrice: PRICE_MAX,
  maxMonthly: null,
  model: '',
}

const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()

export function matchesFilters(v: Vehicle, f: InventoryFilters) {
  const model = normalize(f.model)
  return (
    (f.type === 'Tous' || v.type === f.type) &&
    (f.make === 'Toutes' || v.make === f.make) &&
    v.price <= f.maxPrice &&
    (f.maxMonthly === null || vehicleMonthly(v) <= f.maxMonthly) &&
    (model === '' || normalize(`${v.model} ${v.version}`).includes(model))
  )
}
