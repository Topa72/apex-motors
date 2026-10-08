import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { FadeUp, SectionHeading } from '@/components/FadeUp'
import { SmartImage } from '@/components/SmartImage'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { images } from '@/data/images'
import { EASE_OUT } from '@/lib/utils'

const steps = [
  { title: 'Tell us about it', body: 'Year, make, model, mileage, and honest condition. Two minutes.' },
  { title: 'Get a real number', body: 'Not a range. An actual offer, backed by our current auction and retail data.' },
  {
    title: 'Bring it in',
    body: 'We verify the condition, and if it matches, the offer stands. Apply it to a purchase or take a cheque.',
  },
]

const conditions = ['Excellent', 'Good', 'Fair', 'Needs work']
const years = Array.from({ length: 20 }, (_, i) => String(2026 - i))

export function TradeIn() {
  const [submitted, setSubmitted] = useState(false)
  const [year, setYear] = useState('')
  const [condition, setCondition] = useState('')

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="trade-in" className="bg-background">
      <div className="grid md:grid-cols-2">
        {/* Image: car keys being handed across a counter, shallow depth of field, warm interior dealership lighting, candid moment */}
        <div className="relative h-[320px] overflow-hidden sm:h-[420px] md:h-auto md:min-h-full">
          <SmartImage
            src={images.tradeIn}
            alt="Car keys being handed across a dealership counter"
            label="Trade-in"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-background/40" />
        </div>

        <div className="section-y px-6 md:px-10 lg:px-16">
          <div className="max-w-[560px]">
            <SectionHeading eyebrow="Trade-in" title="Your Car Is Worth More Than You Think" />

            <ol className="mt-8 space-y-5">
              {steps.map((s, i) => (
                <FadeUp key={s.title} i={i + 1} className="flex gap-4">
                  <span className="num flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/50 text-sm text-primary">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                    <p className="text-[15px] text-muted-foreground">{s.body}</p>
                  </div>
                </FadeUp>
              ))}
            </ol>

            <FadeUp i={4} className="mt-10">
              <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
                <AnimatePresence mode="wait" initial={false}>
                  {submitted ? (
                    <motion.div
                      key="done"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: EASE_OUT }}
                      className="flex flex-col items-center py-6 text-center"
                      role="status"
                    >
                      <CheckCircle2 className="h-10 w-10 text-success" aria-hidden />
                      <p className="mt-4 font-display text-xl font-semibold">Thanks — your offer is on its way.</p>
                      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                        An appraiser will text and email a firm number within one business hour.
                      </p>
                      <button type="button" onClick={() => setSubmitted(false)} className="mt-5 text-sm font-semibold text-primary">
                        Value another vehicle
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={onSubmit}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="grid grid-cols-2 gap-3"
                      aria-label="Trade-in valuation"
                    >
                      <div>
                        <Select value={year} onValueChange={setYear} required name="year">
                          <SelectTrigger className="h-12 w-full rounded-lg bg-background/70 font-normal" aria-label="Year">
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {years.map((y) => (
                              <SelectItem key={y} value={y}>
                                {y}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <input className="field" name="make" placeholder="Make" aria-label="Make" required autoComplete="off" />
                      <input className="field" name="model" placeholder="Model" aria-label="Model" required autoComplete="off" />
                      <input
                        className="field"
                        name="mileage"
                        placeholder="Mileage"
                        aria-label="Mileage"
                        inputMode="numeric"
                        pattern="[0-9,]*"
                        required
                      />
                      <div className="col-span-2">
                        <Select value={condition} onValueChange={setCondition} required name="condition">
                          <SelectTrigger className="h-12 w-full rounded-lg bg-background/70 font-normal" aria-label="Condition">
                            <SelectValue placeholder="Condition" />
                          </SelectTrigger>
                          <SelectContent>
                            {conditions.map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <button type="submit" className="btn-primary col-span-2 mt-1 h-12 rounded-lg">
                        Get My Offer
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Offers are good for 7 days and 500 miles, whether or not you buy from us.
              </p>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  )
}
