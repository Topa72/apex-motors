import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export const formatUSD = (n: number) => usd.format(n)
export const formatNumber = (n: number) => n.toLocaleString('en-US')

/** Standard amortised loan payment, rounded to the dollar. */
export function monthlyPayment(principal: number, apr: number, termMonths: number) {
  if (principal <= 0) return 0
  const r = apr / 12
  if (r === 0) return Math.round(principal / termMonths)
  return Math.round((principal * r) / (1 - Math.pow(1 + r, -termMonths)))
}

export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]

export const PHONE_DISPLAY = '(305) 555-0190'
export const PHONE_HREF = 'tel:+13055550190'
export const TOTAL_IN_STOCK = 340
