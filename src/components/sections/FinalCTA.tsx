import { ArrowRight, Phone } from 'lucide-react'
import { FadeUp } from '@/components/FadeUp'
import { PHONE_DISPLAY, PHONE_HREF } from '@/lib/utils'

export function FinalCTA() {
  return (
    <section
      className="relative overflow-hidden bg-[length:200%_200%] animate-gradient-shift"
      style={{ backgroundImage: 'linear-gradient(120deg, #0a90ff, #0b5ed7, #0a90ff)' }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(60% 80% at 85% 20%, rgba(255,255,255,0.35), transparent 60%), radial-gradient(50% 60% at 10% 100%, rgba(4,20,60,0.45), transparent 70%)',
        }}
      />
      <div className="container-site section-y relative flex flex-col gap-10 text-white lg:flex-row lg:items-center lg:justify-between">
        <FadeUp className="max-w-3xl">
          <h2 className="h2 lg:text-[56px]">340 vehicles. One afternoon.</h2>
          <p className="mt-4 text-lg font-normal text-white/85">
            Open seven days. Pre-qualify online, test drive today, and drive home in the same visit if the numbers work.
          </p>
        </FadeUp>
        <FadeUp i={2} className="flex flex-col items-start gap-5 lg:items-end">
          <a href="#inventory" className="btn bg-white px-8 py-4 text-base text-[#0b4fb3] shadow-xl shadow-black/20 hover:bg-white/90">
            Browse Inventory
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
          <a href={PHONE_HREF} className="flex items-center gap-3 font-display text-3xl font-bold tabular-nums tracking-[-0.02em] md:text-4xl">
            <Phone className="h-7 w-7" aria-hidden />
            {PHONE_DISPLAY}
          </a>
        </FadeUp>
      </div>
    </section>
  )
}
