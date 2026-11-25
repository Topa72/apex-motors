import { mkdirSync } from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { resolve } from 'node:path'
import { setEnvironmentContext } from '@netlify/blobs'
import { BlobsServer } from '@netlify/blobs/server'
import type { Plugin, ViteDevServer } from 'vite'

/**
 * Fait tourner les fonctions Netlify dans `npm run dev`, sans compte ni CLI Netlify :
 * les données sont rangées dans .netlify-local/ et le mot de passe admin vaut
 * ADMIN_PASSWORD (par défaut « garage » en local).
 */
type Route = { pattern: RegExp; module: string; params: (m: RegExpMatchArray) => Record<string, string> }

const routes: Route[] = [
  { pattern: /^\/api\/(login|logout|session)$/, module: 'netlify/functions/auth.mts', params: () => ({}) },
  {
    pattern: /^\/api\/vehicles(?:\/([^/]+))?$/,
    module: 'netlify/functions/vehicles.mts',
    params: (m): Record<string, string> => (m[1] ? { id: decodeURIComponent(m[1]) } : {}),
  },
  {
    pattern: /^\/api\/photos(?:\/([^/]+))?$/,
    module: 'netlify/functions/photos.mts',
    params: (m): Record<string, string> => (m[1] ? { key: decodeURIComponent(m[1]) } : {}),
  },
]

export async function startLocalBlobs(directory: string) {
  mkdirSync(directory, { recursive: true })
  const token = 'local-dev'
  const server = new BlobsServer({ directory, token })
  const { port } = await server.start()
  const url = `http://localhost:${port}`
  setEnvironmentContext({ edgeURL: url, uncachedEdgeURL: url, siteID: 'local', token })
  return server
}

function toRequest(req: IncomingMessage, body: Buffer) {
  const headers = new Headers()
  for (const [k, v] of Object.entries(req.headers)) {
    if (Array.isArray(v)) v.forEach((x) => headers.append(k, x))
    else if (v !== undefined) headers.set(k, v)
  }
  return new Request(`http://${req.headers.host ?? 'localhost'}${req.url}`, {
    method: req.method,
    headers,
    body: req.method === 'GET' || req.method === 'HEAD' ? undefined : new Uint8Array(body),
  })
}

async function send(res: ServerResponse, response: Response) {
  res.statusCode = response.status
  response.headers.forEach((v, k) => {
    if (k !== 'set-cookie') res.setHeader(k, v)
  })
  const cookies = response.headers.getSetCookie()
  if (cookies.length) res.setHeader('set-cookie', cookies)
  res.end(Buffer.from(await response.arrayBuffer()))
}

export function localNetlifyApi(): Plugin {
  return {
    name: 'local-netlify-api',
    apply: 'serve',
    async configureServer(server: ViteDevServer) {
      process.env.ADMIN_PASSWORD ||= 'garage'
      await startLocalBlobs(resolve(server.config.root, '.netlify-local/blobs'))
      server.config.logger.info(`  Admin local : /admin, mot de passe « ${process.env.ADMIN_PASSWORD} »`)

      server.middlewares.use(async (req, res, next) => {
        const path = (req.url ?? '').split('?')[0]
        const route = routes.find((r) => r.pattern.test(path))
        if (!route) return next()
        try {
          const chunks: Buffer[] = []
          for await (const chunk of req) chunks.push(chunk as Buffer)
          const mod = (await server.ssrLoadModule(resolve(server.config.root, route.module))) as {
            default: (req: Request, ctx: { params: Record<string, string> }) => Promise<Response>
          }
          const response = await mod.default(toRequest(req, Buffer.concat(chunks)), {
            params: route.params(path.match(route.pattern)!),
          })
          await send(res, response)
        } catch (err) {
          server.config.logger.error(String(err))
          res.statusCode = 500
          res.end('Erreur de la fonction locale')
        }
      })
    },
  }
}
