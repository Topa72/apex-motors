import { Quote, Star } from 'lucide-react'
import { FadeUp, SectionHeading } from '@/components/FadeUp'

const reviews = [
  {
    quote:
      'I filtered by monthly payment instead of price, which is how I actually think about a car. Took twenty minutes to find three options in my range.',
    name: 'Andre W.',
    purchase: '2024 Aurora GT',
  },
  {
    quote:
      'The trade-in offer they gave me online was the same number they gave me in person. I had budgeted a whole afternoon for that argument.',
    name: 'Sofia D.',
    purchase: '2023 Vantage EX',
  },
  {
    quote: 'Finance office took fifty minutes and nobody tried to sell me paint protection. I did not know that was possible.',
    name: 'Kevin O.',
    purchase: '2025 Nimbus EV',
  },
]

export function Reviews() {
  return (
    <section id="reviews" className="section-y bg-card">
      <div className="container-site">
        <SectionHeading eyebrow="Reviews" title="4.8★ from 2,100+ Buyers" />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {reviews.map((r, i) => (
            <FadeUp key={r.name} i={i}>
              <figure className="relative flex h-full flex-col rounded-xl border border-border bg-card-elevated p-7">
                <Quote className="absolute right-6 top-6 h-8 w-8 text-primary/15" aria-hidden />
                <div className="flex gap-1 text-primary" role="img" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }, (_, s) => (
                    <Star key={s} className="h-4 w-4 fill-current" aria-hidden />
                  ))}
                </div>
                <blockquote className="mt-5 flex-1 text-[17px] font-normal leading-relaxed text-foreground/90">
                  “{r.quote}”
                </blockquote>
                <figcaption className="mt-6 border-t border-border pt-5">
                  <p className="font-display font-semibold">{r.name}</p>
                  <p className="text-sm text-muted-foreground">Purchased {r.purchase}</p>
                </figcaption>
              </figure>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
