export const VEHICLE_TYPES = ['SUV', 'Sedan', 'Truck', 'EV', 'Coupe'] as const
export type VehicleType = (typeof VEHICLE_TYPES)[number]

export const MAKES = [
  'Aurora',
  'Brava',
  'Corsa',
  'Halcyon',
  'Kestrel',
  'Meridian',
  'Nimbus',
  'Orion',
  'Ridgeback',
  'Solano',
  'Stratos',
  'Vantage',
] as const
export type Make = (typeof MAKES)[number]

export type Condition = 'New' | 'Certified Pre-Owned' | 'Pre-Owned'

export interface Vehicle {
  id: string
  year: number
  make: Make
  model: string
  type: VehicleType
  miles: number
  drivetrain: 'AWD' | 'RWD' | 'FWD' | '4WD'
  condition: Condition
  price: number
  monthly: number
}

export const vehicleName = (v: Vehicle) => `${v.year} ${v.make} ${v.model}`

/** The first nine are the featured grid; the rest load with "Load more". */
export const inventory: Vehicle[] = [
  { id: 'aurora-gt-line-2024', year: 2024, make: 'Aurora', model: 'GT Line', type: 'Sedan', miles: 12400, drivetrain: 'AWD', condition: 'Certified Pre-Owned', price: 42900, monthly: 612 },
  { id: 'vantage-ex-2023', year: 2023, make: 'Vantage', model: 'EX SUV', type: 'SUV', miles: 21800, drivetrain: 'AWD', condition: 'Certified Pre-Owned', price: 36500, monthly: 521 },
  { id: 'nimbus-ev-lr-2025', year: 2025, make: 'Nimbus', model: 'EV Long Range', type: 'EV', miles: 1200, drivetrain: 'RWD', condition: 'New', price: 51200, monthly: 731 },
  { id: 'ridgeback-crew-2022', year: 2022, make: 'Ridgeback', model: '4x4 Crew', type: 'Truck', miles: 38600, drivetrain: '4WD', condition: 'Certified Pre-Owned', price: 39750, monthly: 567 },
  { id: 'corsa-sport-2024', year: 2024, make: 'Corsa', model: 'Sport Coupe', type: 'Coupe', miles: 8900, drivetrain: 'RWD', condition: 'Certified Pre-Owned', price: 47300, monthly: 675 },
  { id: 'meridian-touring-2023', year: 2023, make: 'Meridian', model: 'Touring', type: 'Sedan', miles: 26100, drivetrain: 'FWD', condition: 'Certified Pre-Owned', price: 28400, monthly: 405 },
  { id: 'vantage-hybrid-2025', year: 2025, make: 'Vantage', model: 'Hybrid', type: 'SUV', miles: 400, drivetrain: 'AWD', condition: 'New', price: 44900, monthly: 641 },
  { id: 'aurora-base-2021', year: 2021, make: 'Aurora', model: 'Base', type: 'Sedan', miles: 52300, drivetrain: 'FWD', condition: 'Pre-Owned', price: 21900, monthly: 313 },
  { id: 'ridgeback-trail-2024', year: 2024, make: 'Ridgeback', model: 'Trail Edition', type: 'Truck', miles: 14700, drivetrain: '4WD', condition: 'Certified Pre-Owned', price: 48600, monthly: 694 },
  { id: 'halcyon-s-2024', year: 2024, make: 'Halcyon', model: 'S Electric', type: 'EV', miles: 6300, drivetrain: 'AWD', condition: 'Certified Pre-Owned', price: 46800, monthly: 668 },
  { id: 'stratos-x-2023', year: 2023, make: 'Stratos', model: 'X Premium', type: 'SUV', miles: 19400, drivetrain: 'AWD', condition: 'Certified Pre-Owned', price: 41200, monthly: 588 },
  { id: 'kestrel-rs-2024', year: 2024, make: 'Kestrel', model: 'RS Coupe', type: 'Coupe', miles: 5100, drivetrain: 'RWD', condition: 'Certified Pre-Owned', price: 63900, monthly: 912 },
  { id: 'solano-le-2022', year: 2022, make: 'Solano', model: 'LE', type: 'Sedan', miles: 31700, drivetrain: 'FWD', condition: 'Pre-Owned', price: 19800, monthly: 283 },
  { id: 'talon-gt-2025', year: 2025, make: 'Orion', model: 'Talon GT', type: 'Coupe', miles: 300, drivetrain: 'AWD', condition: 'New', price: 72400, monthly: 1033 },
  { id: 'velora-ev-2025', year: 2025, make: 'Halcyon', model: 'Velora EV', type: 'EV', miles: 600, drivetrain: 'AWD', condition: 'New', price: 58900, monthly: 841 },
  { id: 'brava-summit-2023', year: 2023, make: 'Brava', model: 'Summit 4x4', type: 'Truck', miles: 27300, drivetrain: '4WD', condition: 'Certified Pre-Owned', price: 43800, monthly: 625 },
  { id: 'orion-lx-2024', year: 2024, make: 'Orion', model: 'LX Grand', type: 'SUV', miles: 9800, drivetrain: 'AWD', condition: 'Certified Pre-Owned', price: 54600, monthly: 779 },
  { id: 'meridian-sport-2024', year: 2024, make: 'Meridian', model: 'Sport', type: 'Sedan', miles: 11200, drivetrain: 'FWD', condition: 'Certified Pre-Owned', price: 31900, monthly: 455 },
]

export interface InventoryFilters {
  type: 'All' | VehicleType
  make: 'All' | Make
  maxPrice: number
  /** Set by the hero quick search; null means no payment cap. */
  maxMonthly: number | null
  /** Free-text model match from the hero quick search. */
  model: string
}

export const PRICE_MIN = 15000
export const PRICE_MAX = 90000

export const defaultFilters: InventoryFilters = {
  type: 'All',
  make: 'All',
  maxPrice: PRICE_MAX,
  maxMonthly: null,
  model: '',
}

export function matchesFilters(v: Vehicle, f: InventoryFilters) {
  const model = f.model.trim().toLowerCase()
  return (
    (f.type === 'All' || v.type === f.type) &&
    (f.make === 'All' || v.make === f.make) &&
    v.price <= f.maxPrice &&
    (f.maxMonthly === null || v.monthly <= f.maxMonthly) &&
    (model === '' || v.model.toLowerCase().includes(model))
  )
}
