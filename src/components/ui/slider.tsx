import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { cn } from '@/lib/utils'

export const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn('relative flex w-full touch-none select-none items-center py-2', className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-foreground/10">
      <SliderPrimitive.Range className="absolute h-full rounded-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      aria-label={props['aria-label']}
      className="block h-5 w-5 cursor-grab rounded-full border-2 border-primary bg-white shadow-[0_0_0_4px_hsl(var(--primary-hsl)/0.18)] transition-shadow hover:shadow-[0_0_0_7px_hsl(var(--primary-hsl)/0.22)] focus-visible:outline-none focus-visible:shadow-[0_0_0_7px_hsl(var(--primary-hsl)/0.35)] active:cursor-grabbing"
    />
  </SliderPrimitive.Root>
))
Slider.displayName = 'Slider'
