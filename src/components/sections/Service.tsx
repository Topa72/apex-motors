import { ArrowRight, Clock, Gauge, Package, Wrench } from 'lucide-react'
import { FadeUp, SectionHeading } from '@/components/FadeUp'
import { PHONE_HREF } from '@/lib/utils'

const services = [
  {
    icon: Wrench,
    title: 'Entretien & révision',
    body: 'Révision selon le carnet d’entretien Citroën, vidange, freins, distribution. Votre garantie constructeur est préservée.',
  },
  {
    icon: Gauge,
    title: 'Diagnostic & réparation',
    body: 'Valise de diagnostic Citroën, pièces d’origine et devis écrit avant toute intervention. Toutes marques acceptées.',
  },
  {
    icon: Package,
    title: 'Pneus, pièces & accessoires',
    body: 'Pneus été et hiver, attelages, barres de toit et pièces d’origine, montés pendant que vous patientez.',
  },
]

const hours = [
  ['Lun–Ven', '8h–12h · 14h–18h30'],
  ['Sam', '8h30–12h'],
  ['Dim', 'Fermé'],
]

export function Service() {
  return (
    <section id="atelier" className="section-y bg-card">
      <div className="container-site">
        <SectionHeading eyebrow="Atelier" title="Votre Citroën entre de bonnes mains">
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Le même atelier qui prépare nos occasions entretient votre véhicule. Véhicule de courtoisie sur
            réservation pour les interventions de plus d’une demi-journée.
          </p>
        </SectionHeading>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {services.map(({ icon: Icon, title, body }, i) => (
            <FadeUp key={title} i={i}>
              <article className="group flex h-full flex-col rounded-xl border border-border bg-card-elevated p-7 transition-colors duration-[250ms] hover:border-primary/30">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mt-6 font-display text-xl font-semibold">{title}</h3>
                <p className="mt-3 flex-1 text-[15px] text-muted-foreground">{body}</p>
                <a href={PHONE_HREF} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Prendre rendez-vous
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </a>
              </article>
            </FadeUp>
          ))}
        </div>

        <FadeUp i={3} className="mt-8">
          <div className="flex flex-col gap-4 rounded-xl border border-border bg-card-elevated px-7 py-5 md:flex-row md:items-center md:justify-between">
            <p className="flex items-center gap-3 font-display text-base font-semibold">
              <Clock className="h-5 w-5 text-primary" aria-hidden />
              Horaires de l’atelier
            </p>
            <dl className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
              {hours.map(([day, time]) => (
                <div key={day} className="flex gap-2">
                  <dt className="text-muted-foreground">{day}</dt>
                  <dd className="font-medium tabular-nums">{time}</dd>
                </div>
              ))}
            </dl>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
