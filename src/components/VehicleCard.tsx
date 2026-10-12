import { ShieldCheck } from 'lucide-react'
import { SmartImage } from '@/components/SmartImage'
import { vehicleImages } from '@/data/images'
import { vehicleMonthly, vehicleName, type Vehicle } from '@/data/inventory'
import { formatEUR, formatNumber } from '@/lib/utils'

const critAirLabel = (n: Vehicle['critAir']) => (n === 0 ? '0 · Élec.' : String(n))

export function VehicleCard({ vehicle: v }: { vehicle: Vehicle }) {
  const name = vehicleName(v)

  return (
    <div className="group h-full overflow-hidden rounded-xl border border-border bg-card transition-[border-color,box-shadow] duration-[250ms] hover:border-primary/30 hover:shadow-[0_24px_50px_-32px_rgba(211,18,31,0.35)]">
      <div className="relative aspect-[16/10] overflow-hidden">
        {/* Image : vue trois-quarts avant sur fond studio sombre, éclairage rasant, carrosserie brillante */}
        <SmartImage
          src={vehicleImages[v.id]}
          alt={`${name} ${v.version}, vue extérieure`}
          label={name}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />
        <span
          className="absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold"
          style={{ background: 'var(--success)', color: '#ffffff' }}
        >
          Disponible
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-black/55 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
          Garantie {v.warrantyMonths} mois
        </span>

        {/* Caractéristiques au survol */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/90 via-black/75 to-transparent px-4 pb-3 pt-10 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100">
          <dl className="grid grid-cols-3 gap-2 text-center">
            {[
              ['Année', String(v.year)],
              ['Boîte', v.gearbox === 'Automatique' ? 'Auto' : 'Manuelle'],
              ['Crit’Air', critAirLabel(v.critAir)],
            ].map(([k, val]) => (
              <div key={k} className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 backdrop-blur">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">{k}</dt>
                <dd className="font-display text-sm font-semibold tabular-nums text-white">{val}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-display text-xl font-semibold leading-snug tracking-[-0.01em]">{name}</h3>
        <p className="truncate text-sm font-normal text-foreground/70">{v.version}</p>
        <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
          <span>
            {v.year} · {formatNumber(v.km)} km · {v.fuel}
          </span>
        </div>
        <div className="mt-4 flex items-end justify-between gap-3 border-t border-border pt-4">
          <span className="num text-2xl">{formatEUR(v.price)}</span>
          <span className="text-right text-sm font-medium text-primary">
            ou <span className="tabular-nums">{formatEUR(vehicleMonthly(v))}</span>/mois*
          </span>
        </div>
      </div>
    </div>
  )
}
