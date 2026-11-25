import { createHash, createHmac, timingSafeEqual } from 'node:crypto'

/**
 * Session administrateur : un seul mot de passe (variable ADMIN_PASSWORD sur Netlify),
 * et un cookie signé valable 30 jours. Changer le mot de passe déconnecte toutes les sessions.
 */
const COOKIE = 'garage_admin'
const MAX_AGE_S = 60 * 60 * 24 * 30

const sha256 = (s: string) => createHash('sha256').update(s).digest()

export function adminPassword(): string | null {
  const pw = process.env.ADMIN_PASSWORD
  return pw && pw.length > 0 ? pw : null
}

function sign(payload: string, password: string) {
  const key = sha256(`garage-admin-session:${password}`)
  return createHmac('sha256', key).update(payload).digest('base64url')
}

function safeEqual(a: Buffer, b: Buffer) {
  return a.length === b.length && timingSafeEqual(a, b)
}

export function passwordMatches(candidate: string, password: string) {
  return safeEqual(sha256(candidate), sha256(password))
}

export function sessionCookie(password: string, secure: boolean) {
  const exp = String(Date.now() + MAX_AGE_S * 1000)
  const token = `${exp}.${sign(exp, password)}`
  return `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${MAX_AGE_S}${secure ? '; Secure' : ''}`
}

export function clearedCookie(secure: boolean) {
  return `${COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure ? '; Secure' : ''}`
}

export const isSecure = (req: Request) => new URL(req.url).protocol === 'https:'

export function isAdmin(req: Request): boolean {
  const password = adminPassword()
  if (!password) return false
  const cookie = req.headers.get('cookie') ?? ''
  const raw = cookie
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE}=`))
    ?.slice(COOKIE.length + 1)
  if (!raw) return false
  const [exp, sig] = raw.split('.')
  if (!exp || !sig || !/^\d+$/.test(exp) || Number(exp) < Date.now()) return false
  return safeEqual(Buffer.from(sig), Buffer.from(sign(exp, password)))
}
