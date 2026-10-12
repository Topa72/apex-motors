import { Quote, Star } from 'lucide-react'
import { FadeUp, SectionHeading } from '@/components/FadeUp'

// Avis d'exemple : à remplacer par de vrais avis clients avant la mise en ligne.
const reviews = [
  {
    quote:
      'J’ai filtré par mensualité plutôt que par prix, c’est comme ça que je raisonne. En vingt minutes j’avais trois voitures dans mon budget.',
    name: 'Nathalie R.',
    context: 'Achat d’une Citroën C3 Aircross',
  },
  {
    quote:
      'L’offre de reprise reçue en ligne était exactement celle proposée au garage. Je m’étais préparé à négocier tout l’après-midi.',
    name: 'Julien M.',
    context: 'Achat d’une Citroën C5 Aircross',
  },
  {
    quote:
      'Berlingo d’occasion pour la famille, carte grise faite et révision à jour à la livraison. Rien à prévoir en rentrant.',
    name: 'Sandrine L.',
    context: 'Achat d’un Citroën Berlingo',
  },
]

export function Reviews() {
  return (
    <section id="avis" className="section-y bg-background">
      <div className="container-site">
        <SectionHeading eyebrow="Avis clients" title="Ils nous ont confié leur voiture" />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {reviews.map((r, i) => (
            <FadeUp key={r.name} i={i}>
              <figure className="relative flex h-full flex-col rounded-xl border border-border bg-card p-7">
                <Quote className="absolute right-6 top-6 h-8 w-8 text-primary/15" aria-hidden />
                <div className="flex gap-1 text-primary" role="img" aria-label="5 étoiles sur 5">
                  {Array.from({ length: 5 }, (_, s) => (
                    <Star key={s} className="h-4 w-4 fill-current" aria-hidden />
                  ))}
                </div>
                <blockquote className="mt-5 flex-1 text-[17px] font-normal leading-relaxed text-foreground/90">
                  « {r.quote} »
                </blockquote>
                <figcaption className="mt-6 border-t border-border pt-5">
                  <p className="font-display font-semibold">{r.name}</p>
                  <p className="text-sm text-muted-foreground">{r.context}</p>
                </figcaption>
              </figure>
            </FadeUp>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted-foreground">Avis d’exemple, à remplacer par vos avis clients.</p>
      </div>
    </section>
  )
}
