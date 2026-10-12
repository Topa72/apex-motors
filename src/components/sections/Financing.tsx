import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Check } from 'lucide-react'
import { FadeUp, SectionHeading } from '@/components/FadeUp'
import { Slider } from '@/components/ui/slider'
import { CREDIT_WARNING, cn, formatEUR, monthlyPayment } from '@/lib/utils'

const APR = 0.059
const TERMS = [24, 36, 48, 60]

const points = [
  'Étude de financement gratuite et sans engagement, réponse sous 24 h',
  'Crédit classique ou location avec option d’achat (LOA)',
  'TAEG à partir de 4,9 % selon votre profil',
]

function Field({
  label,
  value,
  children,
}: {
  label: string
  value: string
  children: ReactNode
}) {
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <span className="text-sm font-medium text-foreground/85">{label}</span>
        <span className="num text-lg">{value}</span>
      </div>
      {children}
    </div>
  )
}

export function Financing() {
  const [price, setPrice] = useState(16000)
  const [down, setDown] = useState(2000)
  const [term, setTerm] = useState(48)
  const [dragging, setDragging] = useState(false)

  // L'apport ne peut jamais dépasser le prix du véhicule.
  const downMax = Math.min(15000, price)
  const effectiveDown = Math.min(down, downMax)
  const principal = Math.max(price - effectiveDown, 0)
  const monthly = monthlyPayment(principal, APR, term)

  // Radix valide au relâchement sur le curseur ; ceci capte un relâchement n'importe où.
  useEffect(() => {
    if (!dragging) return
    const stop = () => setDragging(false)
    window.addEventListener('pointerup', stop)
    window.addEventListener('pointercancel', stop)
    return () => {
      window.removeEventListener('pointerup', stop)
      window.removeEventListener('pointercancel', stop)
    }
  }, [dragging])

  const dragProps = {
    onPointerDown: () => setDragging(true),
    onValueCommit: () => setDragging(false),
  }

  return (
    <section id="financement" className="section-y relative bg-background">
      <div className="container-site grid items-center gap-12 md:grid-cols-2 md:gap-10 lg:gap-20">
        <div>
          <SectionHeading eyebrow="Financement" title="Connaissez votre mensualité avant de venir">
            <p className="mt-5 max-w-lg text-muted-foreground">
              Faites vos calculs ici, demandez une étude de financement en ligne, et venez au garage en sachant
              exactement ce que vous allez signer. Pas de surprise au moment du bon de commande.
            </p>
          </SectionHeading>
          <ul className="mt-8 space-y-4">
            {points.map((p, i) => (
              <FadeUp key={p} i={i + 1} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
                </span>
                <span className="text-foreground/90">{p}</span>
              </FadeUp>
            ))}
          </ul>
        </div>

        <FadeUp i={2}>
          <div className="rounded-2xl border border-border bg-card-elevated p-6 shadow-[0_30px_80px_-40px_rgba(211,18,31,0.18)] md:p-6 lg:p-8">
            <div className="space-y-7">
              <Field label="Prix du véhicule" value={formatEUR(price)}>
                <Slider
                  aria-label="Prix du véhicule"
                  min={5000}
                  max={40000}
                  step={250}
                  value={[price]}
                  onValueChange={([v]) => setPrice(v)}
                  {...dragProps}
                />
              </Field>
              <Field label="Apport" value={formatEUR(effectiveDown)}>
                <Slider
                  aria-label="Apport"
                  min={0}
                  max={downMax}
                  step={500}
                  value={[effectiveDown]}
                  onValueChange={([v]) => setDown(v)}
                  {...dragProps}
                />
              </Field>
              <Field label="Durée" value={`${term} mois`}>
                <Slider
                  aria-label="Durée du crédit en mois"
                  min={24}
                  max={60}
                  step={12}
                  value={[term]}
                  onValueChange={([v]) => setTerm(v)}
                  {...dragProps}
                />
                <div className="mt-2 flex justify-between text-xs tabular-nums text-muted-foreground">
                  {TERMS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTerm(t)}
                      className={cn('w-8 transition-colors hover:text-foreground', t === term && 'font-semibold text-primary')}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            <div className="mt-8 border-t border-border pt-8 text-center">
              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Mensualité estimée</span>
              <div className="flex h-[72px] items-center justify-center overflow-hidden" aria-live="polite">
                <motion.div
                  key={monthly}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="font-display text-6xl font-bold tabular-nums tracking-[-0.03em] text-primary"
                >
                  {formatEUR(monthly)}
                </motion.div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {term} mois · TAEG fixe {(APR * 100).toFixed(1).replace('.', ',')} % · Exemple indicatif, sous réserve
                d’acceptation par l’organisme prêteur
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
            <a href="#financement" className="btn-primary w-full shrink-0 sm:w-auto">
              Demander une étude
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <p className="text-sm text-muted-foreground">Gratuit et sans engagement. Réponse sous 24 h ouvrées.</p>
          </div>
          <p className="mt-5 rounded-lg border border-border px-4 py-3 text-xs font-medium text-foreground/80">
            {CREDIT_WARNING}
          </p>
        </FadeUp>

        {/* Mobile : la mensualité reste visible en bas de l'écran pendant qu'on fait glisser un curseur */}
        <div className="pointer-events-none sticky bottom-4 z-20 -mt-12 h-0 md:hidden" aria-hidden>
          <AnimatePresence>
            {dragging && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-0 left-0 right-0 flex items-center justify-between rounded-2xl border border-primary/40 bg-background/95 px-5 py-3 shadow-2xl shadow-black/20 backdrop-blur"
              >
                <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Mensualité</span>
                <span className="num text-2xl text-primary">{formatEUR(monthly)}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
