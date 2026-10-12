import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <a href="#top" className={cn('group inline-flex items-center gap-2.5', className)} aria-label="Apex Automobiles, accueil">
      <span className="font-display text-[22px] font-extrabold leading-none tracking-[-0.03em]">APEX</span>
      <svg viewBox="0 0 20 14" className="h-3.5 w-5 text-primary transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden>
        <path d="M2 12 10 3l8 9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="font-sans text-[9px] font-semibold uppercase leading-none tracking-[0.32em] text-muted-foreground">
        Automobiles
      </span>
    </a>
  )
}
