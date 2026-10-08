import { Gauge, ShieldCheck } from 'lucide-react'
import { SmartImage } from '@/components/SmartImage'
import { vehicleImages } from '@/data/images'
import { vehicleName, type Vehicle } from '@/data/inventory'
import { formatNumber, formatUSD } from '@/lib/utils'

export function VehicleCard({ vehicle: v }: { vehicle: Vehicle }) {
  const name = vehicleName(v)

  return (
    <div className="group h-full overflow-hidden rounded-xl border border-border bg-card transition-[border-color,box-shadow] duration-[250ms] hover:border-primary/30 hover:shadow-[0_24px_60px_-30px_rgba(10,144,255,0.45)]">
      <div className="relative aspect-[16/10] overflow-hidden">
        {/* Image: modern car three-quarter front view on a clean dark studio floor, dramatic rim lighting, glossy reflective paint, high contrast automotive photography */}
        <SmartImage
          src={vehicleImages[v.id]}
          alt={`${name} exterior`}
          label={`${v.make} ${v.model}`}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />
        <span
          className="absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold"
          style={{ background: 'var(--success)', color: '#04180f' }}
        >
          In stock
        </span>
        {v.condition === 'New' && (
          <span className="absolute right-3 top-3 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground">
            New
          </span>
        )}

        {/* Spec reveal */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/90 via-black/70 to-transparent px-4 pb-3 pt-10 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100">
          <dl className="grid grid-cols-3 gap-2 text-center">
            {[
              ['Body', v.type],
              ['Drive', v.drivetrain],
              ['Miles', formatNumber(v.miles)],
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
        <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          {v.condition === 'Certified Pre-Owned' ? (
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
          ) : (
            <Gauge className="h-3.5 w-3.5 shrink-0" aria-hidden />
          )}
          <span>
            {formatNumber(v.miles)} mi · {v.drivetrain} · {v.condition}
          </span>
        </div>
        <div className="mt-4 flex items-end justify-between border-t border-border pt-4">
          <span className="num text-2xl">{formatUSD(v.price)}</span>
          <span className="text-sm font-medium text-primary">
            or <span className="tabular-nums">{formatUSD(v.monthly)}</span>/mo
          </span>
        </div>
      </div>
    </div>
  )
}
