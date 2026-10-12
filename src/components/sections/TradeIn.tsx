import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { FadeUp, SectionHeading } from '@/components/FadeUp'
import { SmartImage } from '@/components/SmartImage'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { images } from '@/data/images'
import { EASE_OUT } from '@/lib/utils'

const steps = [
  { title: 'Décrivez-le', body: 'Année, marque, modèle, kilométrage et état réel. Deux minutes.' },
  { title: 'Recevez un vrai prix', body: 'Pas une fourchette : une offre ferme, basée sur la cote du marché et nos ventes récentes.' },
  {
    title: 'Déposez-le au garage',
    body: 'Notre atelier vérifie l’état ; s’il correspond, l’offre est maintenue. Déduite de votre achat ou réglée par virement.',
  },
]

const conditions = ['Excellent', 'Bon état', 'État moyen', 'Travaux à prévoir']
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
    <section id="reprise" className="bg-background">
      <div className="grid md:grid-cols-2">
        {/* Image : remise des clés au comptoir, faible profondeur de champ, lumière chaude du showroom */}
        <div className="relative h-[320px] overflow-hidden sm:h-[420px] md:h-auto md:min-h-full">
          <SmartImage
            src={images.tradeIn}
            alt="Remise des clés au comptoir du garage"
            label="Reprise"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-background/40" />
        </div>

        <div className="section-y px-6 md:px-10 lg:px-16">
          <div className="max-w-[560px]">
            <SectionHeading eyebrow="Reprise" title="Votre voiture vaut sans doute plus que vous ne pensez" />

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
                      <p className="mt-4 font-display text-xl font-semibold">Merci, votre demande est bien reçue.</p>
                      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                        Nous vous envoyons une offre ferme par SMS et e-mail sous 24 h ouvrées.
                      </p>
                      <button type="button" onClick={() => setSubmitted(false)} className="mt-5 text-sm font-semibold text-primary">
                        Estimer un autre véhicule
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={onSubmit}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="grid grid-cols-2 gap-3"
                      aria-label="Estimation de reprise"
                    >
                      <div>
                        <Select value={year} onValueChange={setYear} required name="year">
                          <SelectTrigger className="h-12 w-full rounded-lg bg-background/70 font-normal" aria-label="Année">
                            <SelectValue placeholder="Année" />
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
                      <input className="field" name="make" placeholder="Marque" aria-label="Marque" required autoComplete="off" />
                      <input className="field" name="model" placeholder="Modèle" aria-label="Modèle" required autoComplete="off" />
                      <input
                        className="field"
                        name="mileage"
                        placeholder="Kilométrage"
                        aria-label="Kilométrage"
                        inputMode="numeric"
                        pattern="[0-9 .]*"
                        required
                      />
                      <div className="col-span-2">
                        <Select value={condition} onValueChange={setCondition} required name="condition">
                          <SelectTrigger className="h-12 w-full rounded-lg bg-background/70 font-normal" aria-label="État">
                            <SelectValue placeholder="État général" />
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
                        Recevoir mon offre
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Offre valable 7 jours et 500 km, que vous achetiez chez nous ou non.
              </p>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  )
}
