import { Wrench } from 'lucide-react'
import { GARAGE_NAME, GARAGE_TAGLINE, cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <a href="#top" className={cn('group inline-flex shrink-0 items-center gap-3', className)} aria-label={`${GARAGE_NAME}, accueil`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform duration-300 group-hover:-rotate-6">
        <Wrench className="h-[18px] w-[18px]" strokeWidth={2.5} aria-hidden />
      </span>
      <span className="flex flex-col leading-none">
        <span className="whitespace-nowrap font-display text-[19px] font-extrabold tracking-[-0.02em]">{GARAGE_NAME}</span>
        <span className="mt-1 whitespace-nowrap font-sans text-[9px] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
          {GARAGE_TAGLINE}
        </span>
      </span>
    </a>
  )
}
