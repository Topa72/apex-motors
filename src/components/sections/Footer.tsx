import { Clock, MapPin, Phone } from 'lucide-react'
import { Logo } from '@/components/Logo'
import {
  ADDRESS_LINES,
  CREDIT_WARNING,
  GARAGE_NAME,
  MAPS_HREF,
  NETWORK_LABEL,
  OPENING_HOURS,
  PHONE_DISPLAY,
  PHONE_HREF,
} from '@/lib/utils'

const columns = [
  {
    title: 'Occasions',
    links: [
      { label: 'Toutes nos occasions', href: '#occasions' },
      { label: 'Électriques & hybrides', href: '#occasions' },
      { label: 'Comment acheter', href: '#achat' },
    ],
  },
  {
    title: 'Financement & reprise',
    links: [
      { label: 'Simulateur de mensualité', href: '#financement' },
      { label: 'Demander une étude', href: '#financement' },
      { label: 'Estimer ma reprise', href: '#reprise' },
    ],
  },
  {
    title: 'Contact',
    links: [
      { label: `Appeler le ${PHONE_DISPLAY}`, href: PHONE_HREF },
      { label: 'Itinéraire', href: MAPS_HREF },
      { label: 'Avis clients', href: '#avis' },
    ],
  },
]

export function Footer() {
  return (
    <footer id="contact" className="theme-dark bg-footer pt-16 md:pt-20">
      <div className="container-site">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground">Véhicules d’occasion · {NETWORK_LABEL.charAt(0).toUpperCase() + NETWORK_LABEL.slice(1)}</p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex gap-3">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <address className="not-italic text-foreground/85">
                  {ADDRESS_LINES[0]}
                  <br />
                  {ADDRESS_LINES[1]}
                </address>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <a href={PHONE_HREF} className="font-semibold tabular-nums text-foreground/85 hover:text-foreground">
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <p className="text-foreground/85">{OPENING_HOURS}</p>
              </li>
            </ul>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="eyebrow">{col.title}</h3>
              <ul className="mt-5 space-y-3 text-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                      className="text-foreground/75 transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 border-t border-border py-8 text-xs leading-relaxed text-muted-foreground">
          <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:justify-between">
            <p>© 2026 {GARAGE_NAME}. Tous droits réservés.</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <span>SIRET : à compléter · ORIAS : à compléter</span>
              <a href="#top" className="hover:text-foreground">
                Mentions légales
              </a>
              <a href="#top" className="hover:text-foreground">
                Confidentialité
              </a>
              <a href="#top" className="hover:text-foreground">
                Cookies
              </a>
            </div>
          </div>
          <p className="mt-4 max-w-3xl text-muted-foreground/80">
            Mensualités indicatives hors assurance facultative, sous réserve d’acceptation du dossier par l’organisme
            prêteur. Prix TTC, hors frais de carte grise. Disponibilité sous réserve de vente. {CREDIT_WARNING}
          </p>
        </div>
      </div>
    </footer>
  )
}
