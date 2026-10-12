import { Clock, MapPin, Phone } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { CREDIT_WARNING, GARAGE_NAME, PHONE_DISPLAY, PHONE_HREF } from '@/lib/utils'

const columns = [
  {
    title: 'Occasions',
    links: ['Toutes nos occasions', 'Citroën', 'SUV & familiales', 'Électriques & hybrides', 'Moins de 10 000 €'],
    href: '#occasions',
  },
  {
    title: 'Financement & reprise',
    links: ['Simulateur de mensualité', 'Demander une étude', 'Estimer ma reprise', 'Crédit ou LOA ?'],
    href: '#financement',
  },
  {
    title: 'Atelier & contact',
    links: ['Prendre rendez-vous', 'Entretien & révision', 'Pneus & accessoires', 'Nous trouver'],
    href: '#atelier',
  },
]

const socials = [
  {
    label: 'Instagram',
    path: 'M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1.1.4 2.2.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1.1.4-2.2.4-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1.1-.4-2.2-.1-1.3-.1-1.6-.1-4.8s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1.1-.4 2.2-.4 1.2-.1 1.6-.1 4.8-.1zm0 4.9a4.9 4.9 0 1 0 0 9.8 4.9 4.9 0 0 0 0-9.8zm0 8.1a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zm5.1-9.4a1.1 1.1 0 1 0 0 2.3 1.1 1.1 0 0 0 0-2.3z',
  },
  {
    label: 'Facebook',
    path: 'M14 8.5V6.8c0-.8.2-1.3 1.4-1.3H17V2.2c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.6v3.6h2.7V22H14v-9.9h2.7l.4-3.6H14z',
  },
  {
    label: 'YouTube',
    path: 'M21.6 7.2c-.2-.9-.9-1.6-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8c.2.9.9 1.6 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3L10 15z',
  },
]

export function Footer() {
  return (
    <footer className="theme-dark bg-footer pt-16 md:pt-20">
      <div className="container-site">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground">Entretien, réparation et véhicules d’occasion · Atelier toutes marques</p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex gap-3">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <address className="not-italic text-foreground/85">
                  12 rue des Artisans
                  <br />
                  00000 Votre ville
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
                <div className="text-foreground/85">
                  <p>
                    <span className="text-muted-foreground">Vente :</span> lun–sam 9h–12h · 14h–19h
                  </p>
                  <p>
                    <span className="text-muted-foreground">Atelier :</span> lun–ven 8h–12h · 14h–18h30 · sam 8h30–12h
                  </p>
                </div>
              </li>
            </ul>
            <div className="mt-6 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#top"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="eyebrow">{col.title}</h3>
              <ul className="mt-5 space-y-3 text-sm">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href={col.href} className="text-foreground/75 transition-colors hover:text-foreground">
                      {l}
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
