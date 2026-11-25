import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { ExternalLink, Loader2, LogOut, Pencil, Plus, Trash2 } from 'lucide-react'
import type { Vehicle } from '../../shared/vehicle.ts'
import { Logo } from '@/components/Logo'
import { SmartImage } from '@/components/SmartImage'
import { ApiError, ApiUnavailableError, api, photoUrl } from '@/lib/api'
import { GARAGE_NAME, formatEUR, formatNumber } from '@/lib/utils'
import { VehicleForm } from './VehicleForm'

type Gate = 'checking' | 'unavailable' | 'not-configured' | 'login' | 'ready'
type View = { kind: 'list' } | { kind: 'new' } | { kind: 'edit'; vehicle: Vehicle }

function Shell({ children, onLogout }: { children: ReactNode; onLogout?: () => void }) {
  return (
    <div className="min-h-screen bg-card">
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-4 px-4 sm:px-6">
          <Logo href="/" />
          {onLogout && (
            <div className="flex items-center gap-1">
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-foreground/5 hover:text-foreground sm:inline-flex"
              >
                <ExternalLink className="h-4 w-4" aria-hidden />
                Voir le site
              </a>
              <button
                type="button"
                onClick={onLogout}
                aria-label="Se déconnecter"
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
              >
                <LogOut className="h-4 w-4" aria-hidden />
                <span className="hidden sm:inline">Se déconnecter</span>
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
    </div>
  )
}

function Message({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-8 text-center">
      <h1 className="font-display text-2xl font-bold">{title}</h1>
      <div className="mx-auto mt-3 max-w-md text-muted-foreground">{children}</div>
    </div>
  )
}

function Login({ onDone }: { onDone: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await api.login(password)
      onDone()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Connexion impossible. Vérifiez internet et réessayez.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-sm rounded-2xl border border-border bg-background p-6 sm:p-8">
      <h1 className="font-display text-2xl font-bold">Espace garage</h1>
      <p className="mt-2 text-sm text-muted-foreground">Connectez-vous pour ajouter ou retirer des annonces.</p>
      <label htmlFor="admin-password" className="mb-1.5 mt-6 block text-sm font-medium">
        Mot de passe
      </label>
      <input
        id="admin-password"
        type="password"
        className="field bg-background"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'login-error' : undefined}
        autoFocus
      />
      {error && (
        <p id="login-error" role="alert" className="mt-2 text-sm font-medium text-primary">
          {error}
        </p>
      )}
      <button type="submit" disabled={busy || !password} className="btn-primary mt-6 h-12 w-full">
        {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        Se connecter
      </button>
    </form>
  )
}

function VehicleRow({
  vehicle: v,
  onEdit,
  onDelete,
}: {
  vehicle: Vehicle
  onEdit: () => void
  onDelete: () => Promise<void>
}) {
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)

  return (
    <li className="flex flex-col gap-4 rounded-xl border border-border bg-background p-3 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <SmartImage
          src={v.photos[0] ? photoUrl(v.photos[0]) : undefined}
          alt=""
          className="h-16 w-24 shrink-0 rounded-lg object-cover"
        />
        <div className="min-w-0">
          <p className="truncate font-display font-semibold">
            {v.make} {v.model}
          </p>
          <p className="truncate text-sm text-muted-foreground">
            {v.year} · {formatNumber(v.km)} km · {v.fuel}
            {v.photos.length === 0 && <span className="font-medium text-primary"> · sans photo</span>}
          </p>
          <p className="num text-base">{formatEUR(v.price)}</p>
        </div>
      </div>
      {confirming ? (
        <div className="flex items-center gap-2 sm:shrink-0">
          <span className="text-sm font-medium">Retirer du site ?</span>
          <button
            type="button"
            disabled={busy}
            onClick={async () => {
              setBusy(true)
              try {
                await onDelete()
              } finally {
                setBusy(false)
                setConfirming(false)
              }
            }}
            className="btn bg-primary px-4 py-2 text-primary-foreground"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            Oui, supprimer
          </button>
          <button type="button" onClick={() => setConfirming(false)} className="btn-outline px-4 py-2">
            Non
          </button>
        </div>
      ) : (
        <div className="flex gap-2 sm:shrink-0">
          <button type="button" onClick={onEdit} className="btn-outline flex-1 px-4 py-2 sm:flex-none">
            <Pencil className="h-4 w-4" aria-hidden />
            Modifier
          </button>
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="btn-outline flex-1 px-4 py-2 hover:border-primary hover:text-primary sm:flex-none"
          >
            <Trash2 className="h-4 w-4" aria-hidden />
            Supprimer
          </button>
        </div>
      )}
    </li>
  )
}

export default function AdminApp() {
  const [gate, setGate] = useState<Gate>('checking')
  const [view, setView] = useState<View>({ kind: 'list' })
  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null)
  const [listError, setListError] = useState('')
  const [toast, setToast] = useState('')

  useEffect(() => {
    document.title = `Espace garage · ${GARAGE_NAME}`
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex, nofollow'
    document.head.appendChild(robots)
    return () => robots.remove()
  }, [])

  useEffect(() => {
    api
      .session()
      .then((s) => setGate(!s.configured ? 'not-configured' : s.admin ? 'ready' : 'login'))
      .catch((err: unknown) => setGate(err instanceof ApiUnavailableError ? 'unavailable' : 'login'))
  }, [])

  useEffect(() => {
    if (gate !== 'ready') return
    api
      .listVehicles()
      .then(setVehicles)
      .catch(() => setListError('La liste n’a pas pu être chargée. Rechargez la page.'))
  }, [gate])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 3500)
    return () => clearTimeout(t)
  }, [toast])

  const logout = async () => {
    await api.logout().catch(() => {})
    setVehicles(null)
    setView({ kind: 'list' })
    setGate('login')
  }

  const remove = async (v: Vehicle) => {
    try {
      await api.deleteVehicle(v.id)
      setVehicles((list) => list?.filter((x) => x.id !== v.id) ?? null)
      setToast(`${v.make} ${v.model} retirée du site.`)
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) setGate('login')
      else setToast('Suppression impossible. Réessayez.')
    }
  }

  if (gate === 'checking') {
    return (
      <Shell>
        <div className="flex justify-center py-20" aria-label="Chargement">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </Shell>
    )
  }

  if (gate === 'unavailable') {
    return (
      <Shell>
        <Message title="Espace garage indisponible ici">
          La gestion des annonces fonctionne une fois le site en ligne sur Netlify, ou en local avec{' '}
          <code className="rounded bg-card px-1.5 py-0.5 text-sm">npm run dev</code>.
        </Message>
      </Shell>
    )
  }

  if (gate === 'not-configured') {
    return (
      <Shell>
        <Message title="Mot de passe à configurer">
          Ajoutez une variable <code className="rounded bg-card px-1.5 py-0.5 text-sm">ADMIN_PASSWORD</code> dans
          Netlify (Site configuration, Environment variables), puis redéployez le site.
        </Message>
      </Shell>
    )
  }

  if (gate === 'login') {
    return (
      <Shell>
        <Login onDone={() => setGate('ready')} />
      </Shell>
    )
  }

  return (
    <Shell onLogout={logout}>
      {view.kind === 'list' ? (
        <>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-[-0.02em]">Vos annonces</h1>
              <p className="mt-1 text-muted-foreground">
                {vehicles === null
                  ? 'Chargement…'
                  : vehicles.length === 0
                    ? 'Aucun véhicule en ligne pour l’instant.'
                    : `${vehicles.length} véhicule${vehicles.length > 1 ? 's' : ''} en ligne sur le site.`}
              </p>
            </div>
            <button type="button" onClick={() => setView({ kind: 'new' })} className="btn-primary h-12">
              <Plus className="h-5 w-5" aria-hidden />
              Ajouter un véhicule
            </button>
          </div>

          {listError && (
            <p role="alert" className="mt-6 text-sm font-medium text-primary">
              {listError}
            </p>
          )}

          {vehicles?.length === 0 && (
            <div className="mt-8 rounded-2xl border-2 border-dashed border-border px-6 py-14 text-center">
              <p className="font-display text-lg font-semibold">Votre première annonce</p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                Ajoutez un véhicule avec ses photos : il apparaît aussitôt sur le site, dans « Nos occasions en stock ».
              </p>
            </div>
          )}

          {vehicles && vehicles.length > 0 && (
            <ul className="mt-8 space-y-3">
              {vehicles.map((v) => (
                <VehicleRow
                  key={v.id}
                  vehicle={v}
                  onEdit={() => setView({ kind: 'edit', vehicle: v })}
                  onDelete={() => remove(v)}
                />
              ))}
            </ul>
          )}
        </>
      ) : (
        <VehicleForm
          key={view.kind === 'edit' ? view.vehicle.id : 'new'}
          vehicle={view.kind === 'edit' ? view.vehicle : undefined}
          onCancel={() => setView({ kind: 'list' })}
          onSaved={(saved, isNew) => {
            setVehicles((list) => (isNew ? [saved, ...(list ?? [])] : (list ?? []).map((x) => (x.id === saved.id ? saved : x))))
            setView({ kind: 'list' })
            setToast(isNew ? `${saved.make} ${saved.model} est en ligne.` : 'Annonce mise à jour.')
            window.scrollTo({ top: 0 })
          }}
        />
      )}

      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-none fixed inset-x-0 bottom-24 z-40 flex justify-center px-4 transition-opacity duration-300 ${toast ? 'opacity-100' : 'opacity-0'}`}
      >
        {toast && <p className="rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background shadow-xl">{toast}</p>}
      </div>
    </Shell>
  )
}
