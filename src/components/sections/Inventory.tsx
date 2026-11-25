import { useMemo, useState, type Dispatch, type SetStateAction } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, RotateCcw, SlidersHorizontal, X } from 'lucide-react'
import { SectionHeading } from '@/components/FadeUp'
import { VehicleCard } from '@/components/VehicleCard'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet } from '@/components/ui/sheet'
import { Slider } from '@/components/ui/slider'
import {
  ALL_MAKES,
  VEHICLE_TYPES,
  defaultFilters,
  makesIn,
  matchesFilters,
  priceBounds,
  type InventoryFilters,
  type VehicleType,
} from '@/data/inventory'
import type { VehiclesState } from '@/data/useVehicles'
import { EASE_OUT, LISTING_APR, LISTING_TERM, PHONE_HREF, cn, formatEUR } from '@/lib/utils'

const PAGE = 9
const types = ['Tous', ...VEHICLE_TYPES] as const

interface InventoryProps {
  stock: VehiclesState
  filters: InventoryFilters
  setFilters: Dispatch<SetStateAction<InventoryFilters>>
}

function TypeChips({ value, onChange, className }: { value: InventoryFilters['type']; onChange: (t: InventoryFilters['type']) => void; className?: string }) {
  return (
    <div className={cn('flex gap-2', className)} role="radiogroup" aria-label="Type de véhicule">
      {types.map((t) => (
        <button
          key={t}
          type="button"
          role="radio"
          aria-checked={value === t}
          onClick={() => onChange(t)}
          className={cn(
            'h-10 shrink-0 rounded-full border px-4 text-sm font-medium transition-colors',
            value === t
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-card text-foreground/80 hover:border-foreground/30 hover:text-foreground',
          )}
        >
          {t}
        </button>
      ))}
    </div>
  )
}

function MakeSelect({ makes, value, onChange, className }: { makes: string[]; value: string; onChange: (m: string) => void; className?: string }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className} aria-label="Marque">
        <span className="text-muted-foreground">Marque :</span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_MAKES}>Toutes</SelectItem>
        {makes.map((m) => (
          <SelectItem key={m} value={m}>
            {m}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function PriceSlider({
  bounds,
  value,
  onChange,
  className,
}: {
  bounds: { min: number; max: number }
  value: number | null
  onChange: (n: number | null) => void
  className?: string
}) {
  const current = Math.min(value ?? bounds.max, bounds.max)
  return (
    <div className={cn('flex items-center gap-4', className)}>
      <label htmlFor="max-price" className="shrink-0 text-sm text-muted-foreground">
        Prix max. <span className="num ml-1 inline-block min-w-[76px] text-foreground">{formatEUR(current)}</span>
      </label>
      <Slider
        id="max-price"
        aria-label="Prix maximum"
        min={bounds.min}
        max={bounds.max}
        step={500}
        value={[current]}
        // Curseur tout à droite = pas de plafond, pour ne jamais masquer une annonce plus chère.
        onValueChange={([n]) => onChange(n >= bounds.max ? null : n)}
      />
    </div>
  )
}

export function Inventory({ stock, filters, setFilters }: InventoryProps) {
  const [visible, setVisible] = useState(PAGE)
  const [sheetOpen, setSheetOpen] = useState(false)

  const vehicles = stock.vehicles
  const makes = useMemo(() => makesIn(vehicles), [vehicles])
  const bounds = useMemo(() => priceBounds(vehicles), [vehicles])
  const filtered = useMemo(() => vehicles.filter((v) => matchesFilters(v, filters)), [vehicles, filters])
  const shown = filtered.slice(0, visible)

  const update = (patch: Partial<InventoryFilters>) => {
    setFilters((f) => ({ ...f, ...patch }))
    setVisible(PAGE)
  }
  const reset = () => update(defaultFilters)
  const isDirty =
    filters.type !== 'Tous' ||
    filters.make !== ALL_MAKES ||
    filters.maxPrice !== null ||
    filters.maxMonthly !== null ||
    filters.model.trim() !== ''

  const activeExtras = [
    filters.maxMonthly !== null && {
      key: 'monthly',
      label: `Jusqu’à ${formatEUR(filters.maxMonthly)}/mois`,
      clear: () => update({ maxMonthly: null }),
    },
    filters.model.trim() !== '' && {
      key: 'model',
      label: `Modèle : « ${filters.model.trim()} »`,
      clear: () => update({ model: '' }),
    },
  ].filter(Boolean) as { key: string; label: string; clear: () => void }[]

  const count = (
    <span className="whitespace-nowrap text-sm text-muted-foreground" aria-live="polite">
      <span className="num text-foreground">{filtered.length}</span> véhicule{filtered.length > 1 ? 's' : ''}
    </span>
  )

  return (
    <section id="occasions" className="bg-background pt-16 md:pt-20 lg:pt-24">
      <div className="container-site">
        <SectionHeading eyebrow="Véhicules d’occasion" title="Nos occasions en stock">
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Citroën et reprises toutes marques, révisées par notre atelier avant la vente. Contrôle technique de
            moins de 6 mois, carnet d’entretien à jour, garantie incluse.
          </p>
        </SectionHeading>
      </div>

      {/* Barre de filtres collante */}
      <div className="sticky top-[76px] z-30 mt-8 border-y border-border bg-background/95 py-4 backdrop-blur">
        <div className="container-site">
          {/* Ordinateur / tablette */}
          <div className="hidden flex-wrap items-center gap-3 md:flex">
            <Select value={filters.type} onValueChange={(t) => update({ type: t as 'Tous' | VehicleType })}>
              <SelectTrigger aria-label="Type">
                <span className="text-muted-foreground">Type :</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {types.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <MakeSelect makes={makes} value={filters.make} onChange={(make) => update({ make })} />
            <PriceSlider
              bounds={bounds}
              value={filters.maxPrice}
              onChange={(maxPrice) => update({ maxPrice })}
              className="w-[340px] rounded-full border border-border bg-card px-4 lg:w-[380px]"
            />
            {activeExtras.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={c.clear}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
                aria-label={`Retirer le filtre ${c.label}`}
              >
                {c.label}
                <X className="h-3.5 w-3.5" aria-hidden />
              </button>
            ))}
            <div className="ml-auto flex items-center gap-4">
              {isDirty && (
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                  Réinitialiser
                </button>
              )}
              {count}
            </div>
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="relative inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-border bg-card-elevated px-4 text-sm font-semibold"
            >
              <SlidersHorizontal className="h-4 w-4 text-primary" aria-hidden />
              Filtres
              {isDirty && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-primary" />}
            </button>
            <div className="no-scrollbar -mr-6 overflow-x-auto pr-6">
              <TypeChips value={filters.type} onChange={(type) => update({ type })} />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between md:hidden">
            {count}
            {activeExtras.length > 0 && (
              <span className="truncate pl-4 text-xs text-primary">{activeExtras.map((c) => c.label).join(' · ')}</span>
            )}
          </div>
        </div>
      </div>

      <div className="container-site pb-16 pt-10 md:pb-20 lg:pb-24">
        <motion.div layout className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {shown.map((v) => (
              <motion.article
                key={v.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.32, ease: EASE_OUT }}
              >
                <VehicleCard vehicle={v} />
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {stock.status === 'loading' && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" aria-label="Chargement des annonces">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="aspect-[16/10] animate-pulse bg-foreground/5" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-foreground/10" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-foreground/5" />
                  <div className="h-7 w-1/3 animate-pulse rounded bg-foreground/10" />
                </div>
              </div>
            ))}
          </div>
        )}

        {stock.status !== 'loading' && vehicles.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border px-6 py-16 text-center">
            <p className="font-display text-xl font-semibold">
              {stock.status === 'error'
                ? 'Le stock n’a pas pu être chargé.'
                : 'Nos prochaines occasions arrivent bientôt.'}
            </p>
            <p className="mx-auto mt-2 max-w-md text-muted-foreground">
              {stock.status === 'error'
                ? 'Rechargez la page dans un instant, ou appelez-nous pour connaître les véhicules disponibles.'
                : 'Appelez-nous : nous pouvons vous dire ce qui arrive cette semaine, ou chercher le véhicule pour vous.'}
            </p>
            <a href={PHONE_HREF} className="btn-primary mt-6">
              Nous appeler
            </a>
          </div>
        )}

        {vehicles.length > 0 && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-dashed border-border px-6 py-16 text-center"
          >
            <p className="font-display text-xl font-semibold">Aucun véhicule ne correspond pour l’instant.</p>
            <p className="mx-auto mt-2 max-w-md text-muted-foreground">
              Le stock change chaque semaine. Élargissez la recherche, ou appelez-nous : nous pouvons trouver le
              véhicule pour vous.
            </p>
            <button type="button" onClick={reset} className="btn-outline mt-6">
              <RotateCcw className="h-4 w-4" aria-hidden />
              Réinitialiser les filtres
            </button>
          </motion.div>
        )}

        <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-8">
          {filtered.length > visible && (
            <button type="button" onClick={() => setVisible((n) => n + PAGE)} className="btn-outline px-8">
              Voir plus de véhicules
            </button>
          )}
          <a href={PHONE_HREF} className="group inline-flex items-center gap-2 text-sm font-semibold text-primary">
            Vous cherchez un modèle précis ? Nous le trouvons pour vous
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </a>
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          * Mensualité indicative sur {LISTING_TERM} mois sans apport, TAEG fixe de{' '}
          {(LISTING_APR * 100).toFixed(1).replace('.', ',')} %, hors assurance facultative. Sous réserve d’acceptation du
          dossier par l’organisme prêteur.
        </p>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen} title="Filtres" description={`${filtered.length} véhicule${filtered.length > 1 ? 's' : ''} correspondant${filtered.length > 1 ? 's' : ''}`}>
        <div className="space-y-7">
          <div>
            <p className="eyebrow mb-3">Type</p>
            <TypeChips value={filters.type} onChange={(type) => update({ type })} className="flex-wrap" />
          </div>
          <div>
            <p className="eyebrow mb-3">Marque</p>
            <MakeSelect makes={makes} value={filters.make} onChange={(make) => update({ make })} className="h-12 w-full justify-between" />
          </div>
          <div>
            <p className="eyebrow mb-3">Prix</p>
            <PriceSlider bounds={bounds} value={filters.maxPrice} onChange={(maxPrice) => update({ maxPrice })} className="flex-col items-stretch gap-3" />
          </div>
          {activeExtras.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {activeExtras.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={c.clear}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 text-sm font-medium text-primary"
                >
                  {c.label}
                  <X className="h-3.5 w-3.5" aria-hidden />
                </button>
              ))}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button type="button" onClick={reset} className="btn-outline h-12">
              Réinitialiser
            </button>
            <button type="button" onClick={() => setSheetOpen(false)} className="btn-primary h-12">
              Voir {filtered.length} véhicule{filtered.length > 1 ? 's' : ''}
            </button>
          </div>
        </div>
      </Sheet>
    </section>
  )
}
