/**
 * Toutes les photos sont ici : remplacez-les par celles du garage en un seul
 * endroit. Si une URL ne charge pas, <SmartImage> affiche un fond studio
 * aux couleurs du site.
 */
const unsplash = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

export const images = {
  // Voiture moderne sur une route mouillée de nuit, reflets bleutés
  hero: unsplash('photo-1511919884226-fd3cad34687c', 2400),
  // Remise des clés au comptoir, lumière chaude du showroom
  tradeIn: unsplash('photo-1560179707-f14e90ef3623', 1400),
}

/**
 * Photos des annonces, par identifiant de véhicule (voir data/inventory.ts).
 * Déposez les fichiers dans public/photos/ puis ajoutez-les ici, par exemple :
 *   'c3-2022': '/photos/c3-2022.jpg',
 * Sans photo, l'annonce affiche un visuel neutre avec le nom du modèle.
 */
export const vehicleImages: Record<string, string | undefined> = {}
