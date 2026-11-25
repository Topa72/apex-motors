import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { ArrowLeft, ImagePlus, Loader2, Star, X } from 'lucide-react'
import {
  CRIT_AIR_VALUES,
  FUELS,
  GEARBOXES,
  MAKE_SUGGESTIONS,
  MAX_PHOTOS,
  VEHICLE_TYPES,
  WARRANTY_MONTHS,
  validateVehicleInput,
  type FieldErrors,
  type Vehicle,
  type VehicleInput,
} from '../../shared/vehicle.ts'
import { ApiError, api, photoUrl } from '@/lib/api'
import { cn } from '@/lib/utils'
import { resizeImage } from './resizeImage'

type Values = Record<Exclude<keyof VehicleInput, 'photos'>, string>

const emptyValues: Values = {
  make: 'Citroën',
  model: '',
  version: '',
  year: '',
  km: '',
  fuel: '',
  gearbox: '',
  type: '',
  critAir: '',
  warrantyMonths: '12',
  price: '',
}

const toValues = (v: Vehicle): Values => ({
  make: v.make,
  model: v.model,
  version: v.version,
  year: String(v.year),
  km: String(v.km),
  fuel: v.fuel,
  gearbox: v.gearbox,
  type: v.type,
  critAir: v.critAir === null ? '' : String(v.critAir),
  warrantyMonths: String(v.warrantyMonths),
  price: String(v.price),
})

type Upload = { id: string; preview: string; error?: string }

function Field({
  label,
  error,
  hint,
  className,
  children,
}: {
  label: string
  error?: string
  hint?: string
  className?: string
  children: (props: { id: string; 'aria-invalid': boolean; 'aria-describedby'?: string }) => ReactNode
}) {
  const id = useId()
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children({ id, 'aria-invalid': Boolean(error), 'aria-describedby': describedBy })}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-primary">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

const fieldClass = (invalid: boolean) =>
  cn('field bg-background', invalid && 'border-primary focus:border-primary')

export function VehicleForm({
  vehicle,
  onSaved,
  onCancel,
}: {
  vehicle?: Vehicle
  onSaved: (v: Vehicle, isNew: boolean) => void
  onCancel: () => void
}) {
  const [values, setValues] = useState<Values>(vehicle ? toValues(vehicle) : emptyValues)
  const [photos, setPhotos] = useState<string[]>(vehicle?.photos ?? [])
  const [uploads, setUploads] = useState<Upload[]>([])
  const [errors, setErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  // Photos envoyées pendant cette saisie : supprimées si l'on annule, pour ne pas laisser de fichiers orphelins.
  const newKeys = useRef(new Set<string>())
  const fileInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  const set = (k: keyof Values) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [k]: e.target.value }))
    setErrors((er) => ({ ...er, [k]: undefined }))
  }

  const addFiles = async (files: FileList | null) => {
    if (!files?.length) return
    setErrors((er) => ({ ...er, photos: undefined }))
    const room = MAX_PHOTOS - photos.length - uploads.filter((u) => !u.error).length
    const picked = [...files].slice(0, Math.max(0, room))
    if (picked.length < files.length) setErrors((er) => ({ ...er, photos: `${MAX_PHOTOS} photos maximum par annonce.` }))

    const queued: Upload[] = picked.map((file) => ({ id: crypto.randomUUID(), preview: URL.createObjectURL(file) }))
    setUploads((u) => [...u, ...queued])
    // Une à une, dans l'ordre choisi : l'ordre des photos est respecté et le réseau mobile n'est pas saturé.
    for (const [i, file] of picked.entries()) {
      const upload = queued[i]
      try {
        const key = await api.uploadPhoto(await resizeImage(file))
        newKeys.current.add(key)
        setPhotos((p) => [...p, key])
        setUploads((u) => u.filter((x) => x.id !== upload.id))
        URL.revokeObjectURL(upload.preview)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Envoi impossible.'
        setUploads((u) => u.map((x) => (x.id === upload.id ? { ...x, error: message } : x)))
      }
    }
  }

  const removePhoto = (key: string) => {
    setPhotos((p) => p.filter((k) => k !== key))
    // Une photo de cette saisie peut être effacée tout de suite ; une photo déjà publiée
    // ne disparaît qu'à l'enregistrement, au cas où l'on annule.
    if (newKeys.current.has(key)) {
      newKeys.current.delete(key)
      api.deletePhoto(key).catch(() => {})
    }
  }

  const makeMain = (key: string) => setPhotos((p) => [key, ...p.filter((k) => k !== key)])

  const cancel = () => {
    newKeys.current.forEach((key) => api.deletePhoto(key).catch(() => {}))
    onCancel()
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setFormError('')
    if (uploads.some((u) => !u.error)) {
      setFormError('Attendez la fin de l’envoi des photos.')
      return
    }
    const result = validateVehicleInput({ ...values, critAir: values.critAir === '' ? null : values.critAir, photos })
    if (!result.ok) {
      setErrors(result.errors)
      setFormError('Certains champs sont à corriger.')
      document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      return
    }
    setSaving(true)
    try {
      const saved = vehicle ? await api.updateVehicle(vehicle.id, result.value) : await api.createVehicle(result.value)
      newKeys.current.clear()
      onSaved(saved, !vehicle)
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.fields) setErrors(err.fields)
        setFormError(err.status === 401 ? 'Votre session a expiré : reconnectez-vous.' : err.message)
      } else setFormError('Enregistrement impossible. Vérifiez la connexion internet.')
    } finally {
      setSaving(false)
    }
  }

  const uploading = uploads.some((u) => !u.error)

  return (
    <form onSubmit={submit} noValidate className="pb-28">
      <button
        type="button"
        onClick={cancel}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Retour à la liste
      </button>
      <h1 className="font-display text-3xl font-bold tracking-[-0.02em]">
        {vehicle ? 'Modifier l’annonce' : 'Ajouter un véhicule'}
      </h1>

      {/* Photos */}
      <section className="mt-8" aria-labelledby="photos-title">
        <h2 id="photos-title" className="font-display text-lg font-semibold">
          Photos
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          La première photo apparaît sur l’annonce. {MAX_PHOTOS} photos maximum.
        </p>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((key, i) => (
            <li key={key} className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-card">
              <img src={photoUrl(key)} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
              {i === 0 ? (
                <span className="absolute left-2 top-2 rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground">
                  Photo principale
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => makeMain(key)}
                  className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur hover:bg-black/75"
                >
                  <Star className="h-3 w-3" aria-hidden />
                  Mettre en premier
                </button>
              )}
              <button
                type="button"
                onClick={() => removePhoto(key)}
                aria-label={`Retirer la photo ${i + 1}`}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur hover:bg-black/75"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </li>
          ))}
          {uploads.map((u) => (
            <li key={u.id} className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-card">
              <img src={u.preview} alt="" className={cn('h-full w-full object-cover', !u.error && 'opacity-50')} />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3 text-center">
                {u.error ? (
                  <>
                    <p className="rounded-md bg-background/95 px-2 py-1 text-xs font-medium text-primary">{u.error}</p>
                    <button
                      type="button"
                      onClick={() => setUploads((x) => x.filter((y) => y.id !== u.id))}
                      className="rounded-full bg-background/95 px-3 py-1 text-xs font-semibold"
                    >
                      Fermer
                    </button>
                  </>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full bg-background/95 px-3 py-1 text-xs font-semibold">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                    Envoi…
                  </span>
                )}
              </div>
            </li>
          ))}
          {photos.length + uploads.length < MAX_PHOTOS && (
            <li>
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border text-sm font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <ImagePlus className="h-6 w-6" aria-hidden />
                Ajouter des photos
              </button>
            </li>
          )}
        </ul>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          tabIndex={-1}
          aria-hidden
          onChange={(e) => {
            addFiles(e.target.files)
            e.target.value = ''
          }}
        />
        {errors.photos && <p className="mt-2 text-sm font-medium text-primary">{errors.photos}</p>}
      </section>

      {/* Caractéristiques */}
      <section className="mt-10" aria-labelledby="infos-title">
        <h2 id="infos-title" className="font-display text-lg font-semibold">
          Le véhicule
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Marque" error={errors.make}>
            {(p) => (
              <>
                <input {...p} className={fieldClass(p['aria-invalid'])} list="make-suggestions" value={values.make} onChange={set('make')} autoComplete="off" />
                <datalist id="make-suggestions">
                  {MAKE_SUGGESTIONS.map((m) => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
              </>
            )}
          </Field>
          <Field label="Modèle" error={errors.model}>
            {(p) => <input {...p} className={fieldClass(p['aria-invalid'])} placeholder="ex. C3 Aircross" value={values.model} onChange={set('model')} autoComplete="off" />}
          </Field>
          <Field label="Version / finition" hint="Facultatif" error={errors.version} className="sm:col-span-2">
            {(p) => <input {...p} className={fieldClass(p['aria-invalid'])} placeholder="ex. 1.2 PureTech 110 Shine" value={values.version} onChange={set('version')} autoComplete="off" />}
          </Field>
          <Field label="Année" error={errors.year}>
            {(p) => <input {...p} className={fieldClass(p['aria-invalid'])} inputMode="numeric" placeholder="ex. 2021" value={values.year} onChange={set('year')} />}
          </Field>
          <Field label="Kilométrage (km)" error={errors.km}>
            {(p) => <input {...p} className={fieldClass(p['aria-invalid'])} inputMode="numeric" placeholder="ex. 41 200" value={values.km} onChange={set('km')} />}
          </Field>
          <Field label="Carburant" error={errors.fuel}>
            {(p) => (
              <select {...p} className={fieldClass(p['aria-invalid'])} value={values.fuel} onChange={set('fuel')}>
                <option value="">Choisir…</option>
                {FUELS.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            )}
          </Field>
          <Field label="Boîte de vitesses" error={errors.gearbox}>
            {(p) => (
              <select {...p} className={fieldClass(p['aria-invalid'])} value={values.gearbox} onChange={set('gearbox')}>
                <option value="">Choisir…</option>
                {GEARBOXES.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            )}
          </Field>
          <Field label="Type de véhicule" error={errors.type} hint="Sert au filtre « Type » du site">
            {(p) => (
              <select {...p} className={fieldClass(p['aria-invalid'])} value={values.type} onChange={set('type')}>
                <option value="">Choisir…</option>
                {VEHICLE_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            )}
          </Field>
          <Field label="Vignette Crit’Air" error={errors.critAir}>
            {(p) => (
              <select {...p} className={fieldClass(p['aria-invalid'])} value={values.critAir} onChange={set('critAir')}>
                <option value="">Non classé</option>
                {CRIT_AIR_VALUES.map((c) => (
                  <option key={c} value={c}>
                    {c === 0 ? '0 (électrique)' : c}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <Field label="Garantie" error={errors.warrantyMonths}>
            {(p) => (
              <select {...p} className={fieldClass(p['aria-invalid'])} value={values.warrantyMonths} onChange={set('warrantyMonths')}>
                {WARRANTY_MONTHS.map((m) => (
                  <option key={m} value={m}>
                    {m} mois
                  </option>
                ))}
              </select>
            )}
          </Field>
          <Field label="Prix TTC (€)" error={errors.price}>
            {(p) => <input {...p} className={fieldClass(p['aria-invalid'])} inputMode="numeric" placeholder="ex. 16 490" value={values.price} onChange={set('price')} />}
          </Field>
        </div>
      </section>

      {/* Barre d'actions, toujours visible en bas de l'écran */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <p role="alert" className="min-w-0 flex-1 basis-full text-sm font-medium text-primary sm:basis-0">
            {formError}
          </p>
          <button type="button" onClick={cancel} className="btn-outline h-12 flex-1 sm:flex-none">
            Annuler
          </button>
          <button type="submit" disabled={saving || uploading} className="btn-primary h-12 flex-1 sm:flex-none">
            {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            {vehicle ? 'Enregistrer' : 'Publier l’annonce'}
          </button>
        </div>
      </div>
    </form>
  )
}
