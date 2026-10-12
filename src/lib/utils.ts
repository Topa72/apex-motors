import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const eur = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})
const num = new Intl.NumberFormat('fr-FR')

export const formatEUR = (n: number) => eur.format(n)
export const formatNumber = (n: number) => num.format(n)

/** Mensualité d'un crédit amortissable classique, arrondie à l'euro. */
export function monthlyPayment(principal: number, apr: number, termMonths: number) {
  if (principal <= 0) return 0
  const r = apr / 12
  if (r === 0) return Math.round(principal / termMonths)
  return Math.round((principal * r) / (1 - Math.pow(1 + r, -termMonths)))
}

export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]

export const GARAGE_NAME = 'Garage Citroën'
export const PHONE_DISPLAY = '01 99 00 45 12'
export const PHONE_HREF = 'tel:+33199004512'

/** Conditions utilisées pour les mensualités affichées sur les annonces. */
export const LISTING_APR = 0.059
export const LISTING_TERM = 60

/** Mention obligatoire pour toute publicité sur le crédit à la consommation. */
export const CREDIT_WARNING =
  'Un crédit vous engage et doit être remboursé. Vérifiez vos capacités de remboursement avant de vous engager.'
