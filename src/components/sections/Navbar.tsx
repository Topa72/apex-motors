import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, Phone, X } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { EASE_OUT, PHONE_DISPLAY, PHONE_HREF } from '@/lib/utils'

const links = [
  { label: 'Occasions', href: '#occasions' },
  { label: 'Atelier', href: '#atelier' },
  { label: 'Financement', href: '#financement' },
  { label: 'Reprise', href: '#reprise' },
  { label: 'Le garage', href: '#garage' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-40 h-[76px] border-b border-border backdrop-blur-xl transition-[background-color] duration-300"
        style={{ backgroundColor: `rgba(18, 20, 26, ${scrolled || open ? 0.92 : 0.7})` }}
      >
        <nav className="container-site flex h-full items-center justify-between gap-6" aria-label="Navigation principale">
          <Logo />

          <ul className="hidden items-center gap-8 lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-sm font-medium text-foreground/75 transition-colors hover:text-foreground"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-6 lg:flex">
            <a href={PHONE_HREF} className="hidden items-center gap-2 text-sm font-semibold tabular-nums xl:flex">
              <Phone className="h-4 w-4 text-primary" aria-hidden />
              {PHONE_DISPLAY}
            </a>
            <a href="#occasions" className="btn-primary px-5 py-2.5">
              Voir les occasions
            </a>
          </div>

          <button
            type="button"
            className="-mr-2 rounded-full p-2 text-foreground lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 top-[76px] z-[35] flex flex-col bg-background px-6 pb-10 pt-8 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ul className="flex flex-col">
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.04 + i * 0.05, ease: EASE_OUT }}
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-border py-4 font-display text-3xl font-semibold tracking-[-0.02em]"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="mt-auto flex flex-col gap-3">
              <a href={PHONE_HREF} className="btn-outline h-14 text-base">
                <Phone className="h-5 w-5 text-primary" aria-hidden />
                Appeler le {PHONE_DISPLAY}
              </a>
              <a href="#occasions" onClick={() => setOpen(false)} className="btn-primary h-14 text-base">
                Voir les occasions
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
