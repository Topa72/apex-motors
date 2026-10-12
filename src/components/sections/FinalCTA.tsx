import { ArrowRight, Phone } from 'lucide-react'
import { FadeUp } from '@/components/FadeUp'
import { PHONE_DISPLAY, PHONE_HREF } from '@/lib/utils'

export function FinalCTA() {
  return (
    <section
      className="relative overflow-hidden bg-[length:200%_200%] animate-gradient-shift"
      style={{ backgroundImage: 'linear-gradient(120deg, #e3182a, #a50e1a, #e3182a)' }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(60% 80% at 85% 20%, rgba(255,255,255,0.3), transparent 60%), radial-gradient(50% 60% at 10% 100%, rgba(60,0,8,0.4), transparent 70%)',
        }}
      />
      <div className="container-site section-y relative flex flex-col gap-10 text-white lg:flex-row lg:items-center lg:justify-between">
        <FadeUp className="min-w-0 max-w-3xl lg:flex-1">
          <h2 className="h2 lg:text-[56px]">Un seul garage pour l’acheter et l’entretenir.</h2>
          <p className="mt-4 text-lg font-normal text-white/85">
            Essayez votre prochaine voiture cette semaine, et confiez-nous son entretien ensuite. Sur rendez-vous ou
            directement au garage.
          </p>
        </FadeUp>
        <FadeUp i={2} className="flex shrink-0 flex-col items-start gap-5 lg:items-end">
          <a href="#occasions" className="btn bg-white px-8 py-4 text-base text-[#b00f1c] shadow-xl shadow-black/20 hover:bg-white/90">
            Voir les occasions
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
          <a href={PHONE_HREF} className="flex items-center gap-3 whitespace-nowrap font-display text-3xl font-bold tabular-nums tracking-[-0.02em] md:text-4xl">
            <Phone className="h-7 w-7 shrink-0" aria-hidden />
            {PHONE_DISPLAY}
          </a>
        </FadeUp>
      </div>
    </section>
  )
}
