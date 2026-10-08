import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Check } from 'lucide-react'
import { FadeUp, SectionHeading } from '@/components/FadeUp'
import { Slider } from '@/components/ui/slider'
import { cn, formatUSD, monthlyPayment } from '@/lib/utils'

const APR = 0.069
const TERMS = [36, 48, 60, 72]

const points = [
  'Soft credit check for pre-qualification — no impact on your score',
  'We work with 22 lenders, including credit unions',
  'Rates from 4.9% APR for qualified buyers',
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
  const [price, setPrice] = useState(42000)
  const [down, setDown] = useState(5000)
  const [term, setTerm] = useState(60)
  const [dragging, setDragging] = useState(false)

  // The down payment can never exceed the vehicle price.
  const downMax = Math.min(30000, price)
  const effectiveDown = Math.min(down, downMax)
  const principal = Math.max(price - effectiveDown, 0)
  const monthly = monthlyPayment(principal, APR, term)

  // Radix commits on pointerup inside the thumb; this catches releases anywhere.
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
    <section id="financing" className="section-y relative bg-card">
      <div className="container-site grid items-center gap-12 md:grid-cols-2 md:gap-10 lg:gap-20">
        <div>
          <SectionHeading eyebrow="Financing" title="Know the Payment Before You Come In">
            <p className="mt-5 max-w-lg text-muted-foreground">
              Nobody enjoys discovering their real payment after three hours in a windowless office. Run the numbers
              here, get pre-qualified with a soft credit check, and arrive knowing exactly what you are signing.
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
          <div className="rounded-2xl border border-border bg-card-elevated p-6 shadow-[0_30px_80px_-40px_rgba(10,144,255,0.35)] md:p-6 lg:p-8">
            <div className="space-y-7">
              <Field label="Vehicle price" value={formatUSD(price)}>
                <Slider
                  aria-label="Vehicle price"
                  min={10000}
                  max={100000}
                  step={500}
                  value={[price]}
                  onValueChange={([v]) => setPrice(v)}
                  {...dragProps}
                />
              </Field>
              <Field label="Down payment" value={formatUSD(effectiveDown)}>
                <Slider
                  aria-label="Down payment"
                  min={0}
                  max={downMax}
                  step={500}
                  value={[effectiveDown]}
                  onValueChange={([v]) => setDown(v)}
                  {...dragProps}
                />
              </Field>
              <Field label="Term" value={`${term} months`}>
                <Slider
                  aria-label="Loan term in months"
                  min={36}
                  max={72}
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
              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Estimated monthly</span>
              <div className="flex h-[72px] items-center justify-center overflow-hidden" aria-live="polite">
                <motion.div
                  key={monthly}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="font-display text-6xl font-bold tabular-nums tracking-[-0.03em] text-primary"
                >
                  {formatUSD(monthly)}
                </motion.div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {term} months at {(APR * 100).toFixed(1)}% APR · Estimate only, subject to credit approval
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
            <a href="#financing" className="btn-primary w-full sm:w-auto">
              Get Pre-Qualified
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <p className="text-sm text-muted-foreground">Soft credit check only — does not affect your score.</p>
          </div>
        </FadeUp>

        {/* Mobile: monthly figure sticks to the bottom of the section while a slider is dragged */}
        <div className="pointer-events-none sticky bottom-4 z-20 -mt-12 h-0 md:hidden" aria-hidden>
          <AnimatePresence>
            {dragging && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-0 left-0 right-0 flex items-center justify-between rounded-2xl border border-primary/40 bg-background/95 px-5 py-3 shadow-2xl shadow-black/60 backdrop-blur"
              >
                <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Est. monthly</span>
                <span className="num text-2xl text-primary">{formatUSD(monthly)}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
