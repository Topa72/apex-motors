import { useEffect, useState } from 'react'
import { ApiUnavailableError, api } from '@/lib/api'
import { sampleInventory, type Vehicle } from '@/data/inventory'

export type VehiclesState =
  | { status: 'loading'; vehicles: Vehicle[] }
  | { status: 'ready'; vehicles: Vehicle[]; sample: boolean }
  | { status: 'error'; vehicles: Vehicle[] }

/** Stock publié par le garage ; annonces d'exemple quand le site tourne sans l'API (aperçu). */
export function useVehicles(): VehiclesState {
  const [state, setState] = useState<VehiclesState>({ status: 'loading', vehicles: [] })

  useEffect(() => {
    let cancelled = false
    api
      .listVehicles()
      .then((vehicles) => !cancelled && setState({ status: 'ready', vehicles, sample: false }))
      .catch((err: unknown) => {
        if (cancelled) return
        if (err instanceof ApiUnavailableError) setState({ status: 'ready', vehicles: sampleInventory, sample: true })
        else setState({ status: 'error', vehicles: [] })
      })
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
