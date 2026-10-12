import { motion } from 'motion/react'
import { Clock } from 'lucide-react'
import { SectionHeading } from '@/components/FadeUp'
import { EASE_OUT } from '@/lib/utils'

const steps = [
  {
    title: 'Choisir',
    duration: 'À votre rythme',
    body: 'Filtrez par mensualité plutôt que par prix si c’est ainsi que vous budgétez. Chaque annonce affiche les deux.',
  },
  {
    title: 'Financer',
    duration: '2 minutes',
    body: 'Une étude de financement en ligne vous donne un vrai taux et un vrai budget avant de vous déplacer.',
  },
  {
    title: 'Essayer',
    duration: '30 à 45 minutes',
    body: 'Prenez la voie rapide, pas seulement le tour du pâté de maisons. Venez avec le siège auto pour vérifier qu’il rentre.',
  },
  {
    title: 'Repartir',
    duration: 'Environ 1 heure',
    body: 'Carte grise, contrôle technique et révision sont faits avant votre venue. Vous signez et vous repartez au volant.',
  },
]

export function HowItWorks() {
  return (
    <section id="garage" className="section-y bg-card">
      <div className="container-site">
        <SectionHeading eyebrow="Acheter chez nous" title="Comment se passe un achat" />

        <motion.div
          className="relative mt-12 md:mt-16"
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, margin: '-80px 0px' }}
        >
          {/* Ligne de liaison : horizontale sur ordinateur, verticale sur mobile */}
          <motion.div
            aria-hidden
            className="absolute left-5 right-[calc((100%-96px)/4-20px)] top-5 hidden h-px origin-left bg-gradient-to-r from-primary via-primary to-primary/30 md:block"
            variants={{ hidden: { scaleX: 0 }, shown: { scaleX: 1 } }}
            transition={{ duration: 0.9, ease: EASE_OUT }}
          />
          <motion.div
            aria-hidden
            className="absolute bottom-6 left-5 top-5 w-px origin-top bg-gradient-to-b from-primary via-primary/70 to-transparent md:hidden"
            variants={{ hidden: { scaleY: 0 }, shown: { scaleY: 1 } }}
            transition={{ duration: 0.9, ease: EASE_OUT }}
          />

          <ol className="relative grid gap-10 md:grid-cols-4 md:gap-8">
            {steps.map((s, i) => (
              <li key={s.title} className="flex gap-5 md:block">
                <motion.span
                  className="num relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground ring-[6px] ring-card"
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: '-80px 0px' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 18, delay: 0.15 + i * 0.12 }}
                >
                  {i + 1}
                </motion.span>
                <motion.div
                  className="md:mt-6"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px 0px' }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.12, ease: EASE_OUT }}
                >
                  <h3 className="font-display text-xl font-semibold">{s.title}</h3>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                    <Clock className="h-3.5 w-3.5" aria-hidden />
                    {s.duration}
                  </p>
                  <p className="mt-3 text-[15px] text-muted-foreground">{s.body}</p>
                </motion.div>
              </li>
            ))}
          </ol>
        </motion.div>
      </div>
    </section>
  )
}
