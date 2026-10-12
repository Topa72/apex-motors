import { useState, type FormEvent } from 'react'
import { motion } from 'motion/react'
import { ArrowRight, Search } from 'lucide-react'
import { SmartImage } from '@/components/SmartImage'
import { Sheet } from '@/components/ui/sheet'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { images } from '@/data/images'
import { MAKES, inventory, type InventoryFilters, type Make } from '@/data/inventory'
import { EASE_OUT, GARAGE_CITY, NETWORK_LABEL, cn, formatEUR } from '@/lib/utils'

const h1Lines = ['Révisé. Garanti.', 'Prêt à rouler', 'dès aujourd’hui.']
const paymentCaps = [150, 200, 250, 300, 400, 500]

export type QuickSearch = Pick<InventoryFilters, 'make' | 'model' | 'maxMonthly'>

function QuickSearchForm({ onSearch, stacked }: { onSearch: (q: QuickSearch) => void; stacked?: boolean }) {
  const [make, setMake] = useState<'Toutes' | Make>('Toutes')
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
      aria-label="Recherche rapide de véhicules"
    >
      <label className="block">
        <span className="sr-only">Marque</span>
        <Select value={make} onValueChange={(v) => setMake(v as 'Toutes' | Make)}>
          <SelectTrigger className={fieldTrigger} aria-label="Marque">
            <SelectValue placeholder="Marque" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Toutes">Toutes marques</SelectItem>
            {MAKES.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>
      <label className="block">
        <span className="sr-only">Modèle</span>
        <input
          className="field"
          placeholder="Modèle (ex. C3 Aircross)"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          autoComplete="off"
        />
      </label>
      <label className="block">
        <span className="sr-only">Mensualité maximale</span>
        <Select value={maxMonthly} onValueChange={setMaxMonthly}>
          <SelectTrigger className={fieldTrigger} aria-label="Mensualité maximale">
            <SelectValue placeholder="Mensualité max." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Mensualité max.</SelectItem>
            {paymentCaps.map((p) => (
              <SelectItem key={p} value={String(p)}>
                Jusqu’à {formatEUR(p)}/mois
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>
      <button type="submit" className="btn-primary h-12 rounded-lg px-7">
        <Search className="h-4 w-4" aria-hidden />
        Rechercher
      </button>
    </form>
  )
}

export function Hero({ onQuickSearch }: { onQuickSearch: (q: QuickSearch) => void }) {
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <section id="top" className="relative isolate bg-background flex h-[85vh] min-h-[640px] items-center overflow-hidden md:h-screen md:min-h-[760px]">
      {/* Image : voiture moderne sur une route mouillée de nuit, reflets bleutés sur la carrosserie, photo automobile cinématographique */}
      <SmartImage
        src={images.hero}
        alt="Voiture sur une route mouillée, de nuit"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
        fetchPriority="high"
      />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(to right, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.86) 45%, rgba(255,255,255,0.15) 100%)',
        }}
      />

      <div className="w-full pl-6 pr-6 pt-[76px] md:pl-16 md:pr-10">
        <div className="mx-auto max-w-site">
          <div className="max-w-[860px]">
            <motion.p
              className="eyebrow"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
            >
              {GARAGE_CITY} · {inventory.length} occasions en stock
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
              Des occasions Citroën et toutes marques, révisées et préparées par notre atelier de {NETWORK_LABEL},
              garanties jusqu’à 24 mois. Prix affichés, financement et reprise sur place.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.45, ease: EASE_OUT }}
            >
              <a href="#occasions" className="btn-primary">
                Voir les occasions
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <a href="#reprise" className="btn-ghost">
                Estimer ma reprise
              </a>
            </motion.div>
          </div>

          {/* Recherche rapide : carte vitrée sur ordinateur, panneau sur mobile */}
          <motion.div
            className="mt-10 max-w-[920px] md:mt-12"
            initial={{ opacity: 0, scale: 0.97, boxShadow: '0 0 0 0 rgba(211,18,31,0)' }}
            animate={{ opacity: 1, scale: 1, boxShadow: '0 24px 70px -28px rgba(211,18,31,0.35)' }}
            transition={{ duration: 0.6, delay: 0.5, ease: EASE_OUT }}
            style={{ borderRadius: 16, transformOrigin: 'left center' }}
          >
            <div className="hidden rounded-2xl border border-border bg-white/80 p-3 backdrop-blur-xl md:block">
              <QuickSearchForm onSearch={onQuickSearch} />
            </div>
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="flex h-14 w-full items-center gap-3 rounded-2xl border border-border bg-white/90 px-5 text-left text-sm font-medium text-foreground/80 backdrop-blur-xl md:hidden"
            >
              <Search className="h-5 w-5 text-primary" aria-hidden />
              Rechercher un véhicule
            </button>
          </motion.div>
        </div>
      </div>

      <Sheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title="Rechercher un véhicule"
        description="Par marque, par modèle ou par la mensualité qui rentre dans votre budget."
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
