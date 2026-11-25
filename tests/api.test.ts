import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, before, test } from 'node:test'
import { startLocalBlobs } from '../scripts/local-api.ts'

type Handler = (req: Request, ctx: { params: Record<string, string> }) => Promise<Response>

const dir = mkdtempSync(join(tmpdir(), 'garage-blobs-'))
let blobs: Awaited<ReturnType<typeof startLocalBlobs>>
let auth: Handler, vehicles: Handler, photos: Handler
let cookie = ''

const BASE = 'https://garage.test'
const req = (path: string, init: RequestInit & { json?: unknown } = {}) => {
  const headers = new Headers(init.headers)
  if (cookie) headers.set('cookie', cookie)
  let body = init.body
  if (init.json !== undefined) {
    headers.set('content-type', 'application/json')
    body = JSON.stringify(init.json)
  }
  return new Request(BASE + path, { ...init, headers, body })
}

const validVehicle = (photoKeys: string[] = []) => ({
  make: 'Citroën',
  model: 'C3 Aircross',
  version: '1.2 PureTech 110 Shine',
  year: 2021,
  km: '41 200',
  fuel: 'Essence',
  gearbox: 'Manuelle',
  type: 'SUV',
  critAir: 1,
  warrantyMonths: 12,
  price: '16 490',
  photos: photoKeys,
})

before(async () => {
  process.env.ADMIN_PASSWORD = 'secret-test'
  blobs = await startLocalBlobs(dir)
  auth = (await import('../netlify/functions/auth.mts')).default
  vehicles = (await import('../netlify/functions/vehicles.mts')).default
  photos = (await import('../netlify/functions/photos.mts')).default
})

after(async () => {
  await blobs.stop()
  rmSync(dir, { recursive: true, force: true })
})

test('un visiteur voit la liste mais ne peut rien modifier', async () => {
  const list = await vehicles(req('/api/vehicles'), { params: {} })
  assert.equal(list.status, 200)
  assert.deepEqual(await list.json(), { vehicles: [] })

  const session = await (await auth(req('/api/session'), { params: {} })).json()
  assert.deepEqual(session, { admin: false, configured: true })

  const create = await vehicles(req('/api/vehicles', { method: 'POST', json: validVehicle() }), { params: {} })
  assert.equal(create.status, 401)

  const upload = await photos(req('/api/photos', { method: 'POST', body: 'x', headers: { 'content-type': 'image/jpeg' } }), { params: {} })
  assert.equal(upload.status, 401)
})

test('un mauvais mot de passe est refusé', async () => {
  const res = await auth(req('/api/login', { method: 'POST', json: { password: 'nope' } }), { params: {} })
  assert.equal(res.status, 401)
  assert.equal(res.headers.get('set-cookie'), null)
})

test('un cookie falsifié ou expiré est refusé', async () => {
  cookie = `garage_admin=${Date.now() + 1e9}.fausse-signature`
  assert.equal((await (await auth(req('/api/session'), { params: {} })).json()).admin, false)
  cookie = ''
})

test('le garagiste ajoute, modifie et supprime une annonce avec photos', async () => {
  const login = await auth(req('/api/login', { method: 'POST', json: { password: 'secret-test' } }), { params: {} })
  assert.equal(login.status, 200)
  const setCookie = login.headers.get('set-cookie') ?? ''
  assert.match(setCookie, /HttpOnly/)
  assert.match(setCookie, /SameSite=Strict/)
  assert.match(setCookie, /Secure/)
  cookie = setCookie.split(';')[0]
  assert.equal((await (await auth(req('/api/session'), { params: {} })).json()).admin, true)

  // Photos
  const bad = await photos(req('/api/photos', { method: 'POST', body: 'x', headers: { 'content-type': 'text/plain' } }), { params: {} })
  assert.equal(bad.status, 415)
  const keys: string[] = []
  for (const bytes of [[0xff, 0xd8, 0xff, 1], [0xff, 0xd8, 0xff, 2]]) {
    const up = await photos(
      req('/api/photos', { method: 'POST', body: new Uint8Array(bytes), headers: { 'content-type': 'image/jpeg' } }),
      { params: {} },
    )
    assert.equal(up.status, 201)
    keys.push(((await up.json()) as { key: string }).key)
  }

  // Formulaire incomplet
  const invalid = await vehicles(req('/api/vehicles', { method: 'POST', json: { ...validVehicle(), model: '', year: 1800 } }), { params: {} })
  assert.equal(invalid.status, 422)
  const { fields } = (await invalid.json()) as { fields: Record<string, string> }
  assert.ok(fields.model && fields.year)

  // Ajout
  const created = await vehicles(req('/api/vehicles', { method: 'POST', json: validVehicle(keys) }), { params: {} })
  assert.equal(created.status, 201)
  const { vehicle } = (await created.json()) as { vehicle: { id: string; km: number; price: number; photos: string[] } }
  assert.equal(vehicle.km, 41200)
  assert.equal(vehicle.price, 16490)

  // Visible publiquement, photo servie
  cookie = ''
  const list = (await (await vehicles(req('/api/vehicles'), { params: {} })).json()) as { vehicles: unknown[] }
  assert.equal(list.vehicles.length, 1)
  const photo = await photos(req(`/api/photos/${keys[0]}`), { params: { key: keys[0] } })
  assert.equal(photo.status, 200)
  assert.equal(photo.headers.get('content-type'), 'image/jpeg')
  assert.deepEqual([...new Uint8Array(await photo.arrayBuffer())], [0xff, 0xd8, 0xff, 1])
  cookie = setCookie.split(';')[0]

  // Modification : prix changé, deuxième photo retirée puis supprimée du stockage
  const updated = await vehicles(
    req(`/api/vehicles/${vehicle.id}`, { method: 'PUT', json: { ...validVehicle([keys[0]]), price: 15990 } }),
    { params: { id: vehicle.id } },
  )
  assert.equal(updated.status, 200)
  assert.equal(((await updated.json()) as { vehicle: { price: number } }).vehicle.price, 15990)
  assert.equal((await photos(req(`/api/photos/${keys[1]}`), { params: { key: keys[1] } })).status, 404)

  // Suppression : annonce et photo disparaissent
  const del = await vehicles(req(`/api/vehicles/${vehicle.id}`, { method: 'DELETE' }), { params: { id: vehicle.id } })
  assert.equal(del.status, 200)
  assert.deepEqual(await (await vehicles(req('/api/vehicles'), { params: {} })).json(), { vehicles: [] })
  assert.equal((await photos(req(`/api/photos/${keys[0]}`), { params: { key: keys[0] } })).status, 404)

  // Déconnexion
  const logout = await auth(req('/api/logout', { method: 'POST' }), { params: {} })
  assert.match(logout.headers.get('set-cookie') ?? '', /Max-Age=0/)
  cookie = ''
})

test('sans mot de passe configuré, personne ne peut se connecter', async () => {
  const saved = process.env.ADMIN_PASSWORD
  delete process.env.ADMIN_PASSWORD
  const res = await auth(req('/api/login', { method: 'POST', json: { password: '' } }), { params: {} })
  assert.equal(res.status, 503)
  process.env.ADMIN_PASSWORD = saved
})
