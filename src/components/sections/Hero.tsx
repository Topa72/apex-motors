import { useState, type FormEvent } from 'react'
import { motion } from 'motion/react'
import { ArrowRight, Search } from 'lucide-react'
import { SmartImage } from '@/components/SmartImage'
import { Sheet } from '@/components/ui/sheet'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { images } from '@/data/images'
import { MAKES, type InventoryFilters, type Make } from '@/data/inventory'
import { EASE_OUT, TOTAL_IN_STOCK, cn } from '@/lib/utils'

const h1Lines = ['Find it. Finance it.', 'Drive it home', 'today.']
const paymentCaps = [300, 400, 500, 600, 750, 1000]

export type QuickSearch = Pick<InventoryFilters, 'make' | 'model' | 'maxMonthly'>

function QuickSearchForm({ onSearch, stacked }: { onSearch: (q: QuickSearch) => void; stacked?: boolean }) {
  const [make, setMake] = useState<'All' | Make>('All')
  const [model, setModel] = useState('')
  const [maxMonthly, setMaxMonthly] = useState('any')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    onSearch({ make, model, maxMonthly: maxMonthly === 'any' ? null : Number(maxMonthly) })
  }

  const fieldTrigger = 'h-12 w-full rounded-lg bg-background/70 px-4 font-normal'

  return (
    <form
      onSubmit={submit}
      className={cn('grid gap-3', stacked ? 'grid-cols-1' : 'grid-cols-[1fr_1fr_1fr_auto]')}
      aria-label="Quick inventory search"
    >
      <label className="block">
        <span className="sr-only">Make</span>
        <Select value={make} onValueChange={(v) => setMake(v as 'All' | Make)}>
          <SelectTrigger className={fieldTrigger} aria-label="Make">
            <SelectValue placeholder="Make" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">Any make</SelectItem>
            {MAKES.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>
      <label className="block">
        <span className="sr-only">Model</span>
        <input
          className="field"
          placeholder="Model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          autoComplete="off"
        />
      </label>
      <label className="block">
        <span className="sr-only">Max monthly payment</span>
        <Select value={maxMonthly} onValueChange={setMaxMonthly}>
          <SelectTrigger className={fieldTrigger} aria-label="Max monthly payment">
            <SelectValue placeholder="Max monthly payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Max monthly payment</SelectItem>
            {paymentCaps.map((p) => (
              <SelectItem key={p} value={String(p)}>
                Up to ${p.toLocaleString('en-US')}/mo
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>
      <button type="submit" className="btn-primary h-12 rounded-lg px-7">
        <Search className="h-4 w-4" aria-hidden />
        Search
      </button>
    </form>
  )
}

export function Hero({ onQuickSearch }: { onQuickSearch: (q: QuickSearch) => void }) {
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <section id="top" className="relative isolate flex h-[85vh] min-h-[640px] items-center overflow-hidden md:h-screen md:min-h-[760px]">
      {/* Image: sleek modern car on a wet city street at night, neon and streetlight reflections on the paint, cinematic automotive photography, deep blacks and electric blue highlights */}
      <SmartImage
        src={images.hero}
        alt="Vehicle on a wet city street at night"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
        fetchPriority="high"
      />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(to right, rgba(18,20,26,0.95) 0%, rgba(18,20,26,0.6) 45%, rgba(18,20,26,0.25) 100%)',
        }}
      />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-background to-transparent" />

      <div className="w-full pl-6 pr-6 pt-[76px] md:pl-16 md:pr-10">
        <div className="mx-auto max-w-site">
          <div className="max-w-[860px]">
            <motion.p
              className="eyebrow"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
            >
              Miami, FL · {TOTAL_IN_STOCK} vehicles in stock · Open 7 days
            </motion.p>

            <h1
              className="mt-5 font-display font-extrabold"
              style={{ fontSize: 'clamp(40px, 5.6vw, 88px)', letterSpacing: '-0.035em', lineHeight: 1.0 }}
            >
              {h1Lines.map((line, i) => (
                <motion.span
                  key={line}
                  className={cn('block', i === h1Lines.length - 1 && 'text-primary')}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.75, delay: 0.1 + i * 0.1, ease: EASE_OUT }}
                >
                  {line}
                </motion.span>
              ))}
            </h1>

            <motion.p
              className="mt-6 max-w-[540px] text-base text-foreground/80 md:text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.4, ease: EASE_OUT }}
            >
              New and certified pre-owned across twelve makes, with transparent pricing and no four-hour finance
              office marathon.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.45, ease: EASE_OUT }}
            >
              <a href="#inventory" className="btn-primary">
                Browse Inventory
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <a href="#trade-in" className="btn-ghost">
                Value My Trade
              </a>
            </motion.div>
          </div>

          {/* Quick search: glassy card on desktop, sheet on mobile */}
          <motion.div
            className="mt-10 max-w-[920px] md:mt-12"
            initial={{ opacity: 0, scale: 0.97, boxShadow: '0 0 0 0 rgba(10,144,255,0)' }}
            animate={{ opacity: 1, scale: 1, boxShadow: '0 20px 80px -20px rgba(10,144,255,0.45)' }}
            transition={{ duration: 0.6, delay: 0.5, ease: EASE_OUT }}
            style={{ borderRadius: 16, transformOrigin: 'left center' }}
          >
            <div className="hidden rounded-2xl border border-white/10 bg-[rgba(24,27,34,0.62)] p-3 backdrop-blur-xl md:block">
              <QuickSearchForm onSearch={onQuickSearch} />
            </div>
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="flex h-14 w-full items-center gap-3 rounded-2xl border border-white/10 bg-[rgba(24,27,34,0.7)] px-5 text-left text-sm font-medium text-foreground/80 backdrop-blur-xl md:hidden"
            >
              <Search className="h-5 w-5 text-primary" aria-hidden />
              Search inventory
            </button>
          </motion.div>
        </div>
      </div>

      <Sheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title="Search inventory"
        description="Shop by make, model or the monthly payment you actually budget for."
      >
        <QuickSearchForm
          stacked
          onSearch={(q) => {
            setSheetOpen(false)
            onQuickSearch(q)
          }}
        />
      </Sheet>
    </section>
  )
}
