import { motion } from 'motion/react'
import { ClipboardCheck, Repeat, ShieldCheck, Wrench } from 'lucide-react'
import { NETWORK_LABEL } from '@/lib/utils'

const items = [
  { icon: ShieldCheck, label: 'Occasions garanties 12 à 24 mois' },
  { icon: ClipboardCheck, label: 'Contrôle en 100 points à l’atelier' },
  { icon: Wrench, label: `Préparées par un ${NETWORK_LABEL}` },
  { icon: Repeat, label: 'Reprise de votre ancien véhicule' },
]

export function TrustStrip() {
  return (
    <section aria-label="Nos engagements" className="border-y border-border bg-card">
      <ul className="container-site grid grid-cols-2 gap-x-4 gap-y-5 py-6 md:grid-cols-4 md:py-7">
        {items.map(({ icon: Icon, label }, i) => (
          <li key={label} className="flex items-center gap-3 md:justify-center">
            <motion.span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
              initial={{ boxShadow: '0 0 0 0 rgba(211,18,31,0)' }}
              whileInView={{
                boxShadow: [
                  '0 0 0 0 rgba(211,18,31,0)',
                  '0 0 22px 4px rgba(211,18,31,0.45)',
                  '0 0 0 0 rgba(211,18,31,0)',
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
