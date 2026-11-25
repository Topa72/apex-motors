export const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
  })

export const error = (status: number, message: string) => json({ error: message }, status)

export const methodNotAllowed = (allowed: string[]) =>
  new Response(null, { status: 405, headers: { Allow: allowed.join(', ') } })

/** Lit un corps JSON ; null si le corps n'est pas du JSON. */
export async function readJson(req: Request): Promise<unknown> {
  if (!req.headers.get('content-type')?.includes('application/json')) return null
  try {
    return await req.json()
  } catch {
    return null
  }
}
