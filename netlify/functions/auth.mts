import type { Config } from '@netlify/functions'
import { adminPassword, clearedCookie, isAdmin, isSecure, passwordMatches, sessionCookie } from '../lib/auth.ts'
import { error, json, methodNotAllowed, readJson } from '../lib/http.ts'

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

export default async (req: Request) => {
  const path = new URL(req.url).pathname

  if (path === '/api/session') {
    if (req.method !== 'GET') return methodNotAllowed(['GET'])
    return json({ admin: isAdmin(req), configured: adminPassword() !== null })
  }

  if (path === '/api/logout') {
    if (req.method !== 'POST') return methodNotAllowed(['POST'])
    return json({ admin: false }, 200, { 'Set-Cookie': clearedCookie(isSecure(req)) })
  }

  // /api/login
  if (req.method !== 'POST') return methodNotAllowed(['POST'])
  const password = adminPassword()
  if (!password) return error(503, 'Le mot de passe administrateur n’est pas encore configuré sur Netlify.')
  const body = (await readJson(req)) as { password?: unknown } | null
  const candidate = typeof body?.password === 'string' ? body.password : ''
  if (!passwordMatches(candidate, password)) {
    await wait(800) // freine les essais de mots de passe en série
    return error(401, 'Mot de passe incorrect.')
  }
  return json({ admin: true }, 200, { 'Set-Cookie': sessionCookie(password, isSecure(req)) })
}

export const config: Config = { path: ['/api/login', '/api/logout', '/api/session'] }
