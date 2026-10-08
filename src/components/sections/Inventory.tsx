import { useMemo, useState, type Dispatch, type SetStateAction } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, RotateCcw, SlidersHorizontal, X } from 'lucide-react'
import { SectionHeading } from '@/components/FadeUp'
import { VehicleCard } from '@/components/VehicleCard'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet } from '@/components/ui/sheet'
import { Slider } from '@/components/ui/slider'
import {
  MAKES,
  PRICE_MAX,
  PRICE_MIN,
  VEHICLE_TYPES,
  defaultFilters,
  inventory,
  matchesFilters,
  type InventoryFilters,
  type Make,
  type VehicleType,
} from '@/data/inventory'
import { EASE_OUT, TOTAL_IN_STOCK, cn, formatUSD } from '@/lib/utils'

const PAGE = 9
const types = ['All', ...VEHICLE_TYPES] as const

interface InventoryProps {
  filters: InventoryFilters
  setFilters: Dispatch<SetStateAction<InventoryFilters>>
}

function TypeChips({ value, onChange, className }: { value: InventoryFilters['type']; onChange: (t: InventoryFilters['type']) => void; className?: string }) {
  return (
    <div className={cn('flex gap-2', className)} role="radiogroup" aria-label="Vehicle type">
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
              : 'border-border bg-card text-foreground/80 hover:border-white/25 hover:text-foreground',
          )}
        >
          {t}
        </button>
      ))}
    </div>
  )
}

function MakeSelect({ value, onChange, className }: { value: InventoryFilters['make']; onChange: (m: InventoryFilters['make']) => void; className?: string }) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as 'All' | Make)}>
      <SelectTrigger className={className} aria-label="Make">
        <span className="text-muted-foreground">Make:</span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="All">All makes</SelectItem>
        {MAKES.map((m) => (
          <SelectItem key={m} value={m}>
            {m}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function PriceSlider({ value, onChange, className }: { value: number; onChange: (n: number) => void; className?: string }) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      <label htmlFor="max-price" className="shrink-0 text-sm text-muted-foreground">
        Max price <span className="num ml-1 inline-block min-w-[72px] text-foreground">{formatUSD(value)}</span>
      </label>
      <Slider
        id="max-price"
        aria-label="Maximum price"
        min={PRICE_MIN}
        max={PRICE_MAX}
        step={500}
        value={[value]}
        onValueChange={([n]) => onChange(n)}
      />
    </div>
  )
}

export function Inventory({ filters, setFilters }: InventoryProps) {
  const [visible, setVisible] = useState(PAGE)
  const [sheetOpen, setSheetOpen] = useState(false)

  const filtered = useMemo(() => inventory.filter((v) => matchesFilters(v, filters)), [filters])
  const shown = filtered.slice(0, visible)

  const update = (patch: Partial<InventoryFilters>) => {
    setFilters((f) => ({ ...f, ...patch }))
    setVisible(PAGE)
  }
  const reset = () => update(defaultFilters)
  const isDirty =
    filters.type !== 'All' ||
    filters.make !== 'All' ||
    filters.maxPrice !== PRICE_MAX ||
    filters.maxMonthly !== null ||
    filters.model.trim() !== ''

  const activeExtras = [
    filters.maxMonthly !== null && {
      key: 'monthly',
      label: `Up to ${formatUSD(filters.maxMonthly)}/mo`,
      clear: () => update({ maxMonthly: null }),
    },
    filters.model.trim() !== '' && {
      key: 'model',
      label: `Model: “${filters.model.trim()}”`,
      clear: () => update({ model: '' }),
    },
  ].filter(Boolean) as { key: string; label: string; clear: () => void }[]

  const count = (
    <span className="whitespace-nowrap text-sm text-muted-foreground" aria-live="polite">
      <span className="num text-foreground">{filtered.length}</span> vehicles
    </span>
  )

  return (
    <section id="inventory" className="bg-background pt-16 md:pt-20 lg:pt-24">
      <div className="container-site">
        <SectionHeading eyebrow="In stock now" title="Browse Inventory" />
      </div>

      {/* Sticky filter bar */}
      <div className="sticky top-[76px] z-30 mt-8 border-y border-border bg-background/95 py-4 backdrop-blur">
        <div className="container-site">
          {/* Desktop / tablet */}
          <div className="hidden flex-wrap items-center gap-3 md:flex">
            <Select value={filters.type} onValueChange={(t) => update({ type: t as 'All' | VehicleType })}>
              <SelectTrigger aria-label="Type">
                <span className="text-muted-foreground">Type:</span>
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
            <MakeSelect value={filters.make} onChange={(make) => update({ make })} />
            <PriceSlider
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
                aria-label={`Remove filter ${c.label}`}
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
                  Reset
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
              Filters
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

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-dashed border-border px-6 py-16 text-center"
          >
            <p className="font-display text-xl font-semibold">Nothing matches those filters right now.</p>
            <p className="mx-auto mt-2 max-w-md text-muted-foreground">
              Stock changes daily. Widen the search, or call us and we will tell you what is arriving this week.
            </p>
            <button type="button" onClick={reset} className="btn-outline mt-6">
              <RotateCcw className="h-4 w-4" aria-hidden />
              Reset filters
            </button>
          </motion.div>
        )}

        <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-8">
          {filtered.length > visible && (
            <button type="button" onClick={() => setVisible((n) => n + PAGE)} className="btn-outline px-8">
              Load more
            </button>
          )}
          <a
            href="#inventory"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-primary"
          >
            View all {TOTAL_IN_STOCK} vehicles
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </a>
        </div>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen} title="Filters" description={`${filtered.length} vehicles match`}>
        <div className="space-y-7">
          <div>
            <p className="eyebrow mb-3">Type</p>
            <TypeChips value={filters.type} onChange={(type) => update({ type })} className="flex-wrap" />
          </div>
          <div>
            <p className="eyebrow mb-3">Make</p>
            <MakeSelect value={filters.make} onChange={(make) => update({ make })} className="h-12 w-full justify-between" />
          </div>
          <div>
            <p className="eyebrow mb-3">Price</p>
            <PriceSlider value={filters.maxPrice} onChange={(maxPrice) => update({ maxPrice })} className="flex-col items-stretch gap-3" />
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
              Reset
            </button>
            <button type="button" onClick={() => setSheetOpen(false)} className="btn-primary h-12">
              Show {filtered.length} vehicles
            </button>
          </div>
        </div>
      </Sheet>
    </section>
  )
}
