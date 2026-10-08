import type { ReactNode } from 'react'
import { motion, type HTMLMotionProps } from 'motion/react'
import { EASE_OUT } from '@/lib/utils'

interface FadeUpProps extends HTMLMotionProps<'div'> {
  i?: number
}

/** Effect 4: fade up into view, staggered by index. */
export function FadeUp({ i = 0, children, ...props }: FadeUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px 0px' }}
      transition={{ duration: 0.6, delay: i * 0.06, ease: EASE_OUT }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  className,
  children,
}: {
  eyebrow: string
  title: string
  className?: string
  children?: ReactNode
}) {
  return (
    <FadeUp className={className}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="h2 mt-3">{title}</h2>
      {children}
    </FadeUp>
  )
}
