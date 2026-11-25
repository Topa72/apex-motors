import { Suspense, lazy } from 'react'
import App from './App.tsx'

// L'espace garage est chargé à part : les visiteurs ne téléchargent pas son code.
const AdminApp = lazy(() => import('./admin/AdminApp.tsx'))

export function Root() {
  if (/^\/admin\/?$/.test(window.location.pathname)) {
    return (
      <Suspense fallback={null}>
        <AdminApp />
      </Suspense>
    )
  }
  return <App />
}
