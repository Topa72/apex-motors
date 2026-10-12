import { useState, type ImgHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface SmartImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** Légende affichée sur le visuel de remplacement. */
  label?: string
}

/**
 * Image qui se replie sur un fond studio aux couleurs du site au lieu d'une icône cassée.
 */
export function SmartImage({ className, label, alt, onError, ...props }: SmartImageProps) {
  const [failed, setFailed] = useState(false)

  if (failed || !props.src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn('relative flex items-end overflow-hidden bg-card-elevated', className)}
        style={{
          backgroundImage:
            'radial-gradient(120% 70% at 70% 30%, hsl(206 100% 52% / 0.28), transparent 60%), radial-gradient(90% 40% at 50% 100%, hsl(206 100% 52% / 0.18), transparent 70%), linear-gradient(180deg, hsl(220 12% 16%), hsl(220 14% 8%))',
        }}
      >
        <svg
          viewBox="0 0 400 120"
          className="absolute left-1/2 top-1/2 w-3/4 max-w-md -translate-x-1/2 -translate-y-1/3 text-white/15"
          aria-hidden
        >
          <path
            fill="currentColor"
            d="M30 92c-8 0-12-5-12-12v-8c0-8 5-13 14-15l52-10 46-24c10-5 20-7 31-7h70c13 0 25 4 35 12l30 22 52 8c18 3 30 13 30 30v4c0 7-4 12-11 12h-14a34 34 0 0 0-67 0H140a34 34 0 0 0-67 0H30z"
          />
          <circle cx="106" cy="92" r="24" fill="currentColor" />
          <circle cx="306" cy="92" r="24" fill="currentColor" />
        </svg>
        {label ? (
          <span className="relative m-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40 transition-opacity duration-300 group-hover:opacity-0">
            {label}
          </span>
        ) : null}
      </div>
    )
  }

  return (
    <img
      alt={alt}
      className={className}
      onError={(e) => {
        setFailed(true)
        onError?.(e)
      }}
      {...props}
    />
  )
}
