import { motion } from 'motion/react'
import { ClipboardCheck, ShieldCheck, Star, Wrench } from 'lucide-react'

const items = [
  { icon: ShieldCheck, label: 'Occasions garanties 12 à 24 mois' },
  { icon: ClipboardCheck, label: 'Contrôle en 100 points à l’atelier' },
  { icon: Wrench, label: 'Techniciens formés Citroën' },
  { icon: Star, label: '4,8/5 sur 320 avis clients' },
]

export function TrustStrip() {
  return (
    <section aria-label="Nos engagements" className="border-y border-border bg-card">
      <ul className="container-site grid grid-cols-2 gap-x-4 gap-y-5 py-6 md:grid-cols-4 md:py-7">
        {items.map(({ icon: Icon, label }, i) => (
          <li key={label} className="flex items-center gap-3 md:justify-center">
            <motion.span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
              initial={{ boxShadow: '0 0 0 0 rgba(10,144,255,0)' }}
              whileInView={{
                boxShadow: [
                  '0 0 0 0 rgba(10,144,255,0)',
                  '0 0 22px 4px rgba(10,144,255,0.45)',
                  '0 0 0 0 rgba(10,144,255,0)',
                ],
              }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <Icon className="h-5 w-5" aria-hidden />
            </motion.span>
            <span className="text-sm font-medium leading-snug text-foreground/90">{label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
