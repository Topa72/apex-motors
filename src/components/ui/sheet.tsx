import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

/** Panneau bas utilisé sur mobile pour les filtres et la recherche rapide. */
export function Sheet({ open, onOpenChange, title, description, children, className }: SheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm data-[state=open]:animate-[fade-in_0.2s_ease-out]" />
        <Dialog.Content
          className={cn(
            'fixed inset-x-0 bottom-0 z-[60] max-h-[88vh] overflow-y-auto rounded-t-3xl border-t border-border bg-card-elevated px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 shadow-2xl outline-none data-[state=open]:animate-[sheet-up_0.32s_cubic-bezier(0.22,1,0.36,1)]',
            className,
          )}
        >
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-foreground/20" />
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="font-display text-xl font-semibold">{title}</Dialog.Title>
              {description ? (
                <Dialog.Description className="mt-1 text-sm text-muted-foreground">{description}</Dialog.Description>
              ) : (
                <Dialog.Description className="sr-only">{title}</Dialog.Description>
              )}
            </div>
            <Dialog.Close
              className="-mr-2 rounded-full p-2 text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
