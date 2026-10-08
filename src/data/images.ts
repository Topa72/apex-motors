/**
 * All photography lives here so it can be swapped for the dealership's own
 * shots in one place. Every <SmartImage> falls back to a branded studio
 * gradient if a URL fails to load.
 */
const unsplash = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

export const images = {
  // Sleek modern car on a wet city street at night, neon reflections
  hero: unsplash('photo-1511919884226-fd3cad34687c', 2400),
  // Car keys handed across a counter, warm dealership lighting
  tradeIn: unsplash('photo-1560179707-f14e90ef3623', 1400),
}

/** Three-quarter studio shots for inventory cards, keyed by vehicle id. */
export const vehicleImages: Record<string, string> = {
  'aurora-gt-line-2024': unsplash('photo-1555215695-3004980ad54e'),
  'vantage-ex-2023': unsplash('photo-1606664515524-ed2f786a0bd6'),
  'nimbus-ev-lr-2025': unsplash('photo-1560958089-b8a1929cea89'),
  'ridgeback-crew-2022': unsplash('photo-1533473359331-0135ef1b58bf'),
  'corsa-sport-2024': unsplash('photo-1503376780353-7e6692767b70'),
  'meridian-touring-2023': unsplash('photo-1549317661-bd32c8ce0db2'),
  'vantage-hybrid-2025': unsplash('photo-1617814076367-b759c7d7e738'),
  'aurora-base-2021': unsplash('photo-1542362567-b07e54358753'),
  'ridgeback-trail-2024': unsplash('photo-1559416523-140ddc3d238c'),
  'halcyon-s-2024': unsplash('photo-1617788138017-80ad40651399'),
  'stratos-x-2023': unsplash('photo-1580273916550-e323be2ae537'),
  'kestrel-rs-2024': unsplash('photo-1544636331-e26879cd4d9b'),
  'solano-le-2022': unsplash('photo-1502877338535-766e1452684a'),
  'talon-gt-2025': unsplash('photo-1583121274602-3e2820c69888'),
  'velora-ev-2025': unsplash('photo-1553440569-bcc63803a83d'),
  'brava-summit-2023': unsplash('photo-1519641471654-76ce0107ad1b'),
  'orion-lx-2024': unsplash('photo-1525609004556-c46c7d6cf023'),
  'meridian-sport-2024': unsplash('photo-1494976388531-d1058494cdd8'),
}
