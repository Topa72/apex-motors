# Garage de la Champagne

Site de vente de véhicules d’occasion du Garage de la Champagne (réparateur agréé Citroën, Bernay-en-Champagne, Sarthe) : annonces filtrables, simulateur de mensualité, reprise, étapes d’achat, avis et contact.

Le garagiste gère lui-même ses annonces depuis **`/admin`** : il se connecte avec un mot de passe, ajoute un véhicule avec ses photos, le modifie ou le supprime. Les visiteurs voient le stock à jour, sans pouvoir rien modifier.

**Technique :** React 19 · Vite · TypeScript · Tailwind CSS 3 · Motion (`motion/react`) · composants Radix au format shadcn · lucide-react · Netlify Functions + Netlify Blobs pour les annonces et les photos

## Lancer le site

```bash
npm install
npm run dev      # http://localhost:5173, espace garage sur /admin (mot de passe local : garage)
npm test         # tests de l'API (connexion, annonces, photos)
npm run build    # vérification TypeScript + build de production
npm run lint     # oxlint
```

En local, `npm run dev` fait aussi tourner l’API : les annonces et les photos sont rangées dans `.netlify-local/` (non versionné). Pour un autre mot de passe local : `ADMIN_PASSWORD=monmotdepasse npm run dev`.

## Mise en ligne sur Netlify

1. Créer un compte gratuit sur [netlify.com](https://www.netlify.com).
2. **Add new project → Import an existing project → GitHub**, choisir ce dépôt et la branche à publier. Les réglages de build sont lus dans `netlify.toml`, rien à remplir.
3. **Project configuration → Environment variables → Add a variable** : `ADMIN_PASSWORD` = le mot de passe du garagiste (12 caractères ou plus, pas un mot du dictionnaire).
4. **Deploys → Trigger deploy** pour prendre en compte le mot de passe.
5. Ouvrir `https://<nom-du-site>.netlify.app/admin`, se connecter et ajouter les véhicules.
6. Facultatif : **Domain management → Add a domain** pour brancher `garagedelachampagne.fr` ou un autre nom.

Le stockage des annonces et des photos (Netlify Blobs) s’active tout seul, sans réglage. Changer `ADMIN_PASSWORD` puis redéployer déconnecte toutes les sessions ouvertes.

## Comment ça marche

| Élément | Rôle |
| --- | --- |
| `src/admin/` | Espace garage : connexion, liste des annonces, formulaire avec photos |
| `netlify/functions/auth.mts` | Connexion par mot de passe, cookie de session signé (30 jours, HttpOnly) |
| `netlify/functions/vehicles.mts` | Liste publique des annonces ; ajout, modification, suppression réservés au garagiste |
| `netlify/functions/photos.mts` | Envoi des photos (réduites à 1600 px dans le navigateur avant l’envoi) et affichage public |
| `shared/vehicle.ts` | Format d’une annonce et vérification des champs, communs au site et au serveur |
| `scripts/local-api.ts` | Fait tourner ces fonctions dans `npm run dev` |

Sans API (simple aperçu du build, par exemple `npm run preview`), le site affiche des annonces d’exemple tirées de `src/data/inventory.ts`.

## Où modifier quoi

| À changer | Fichier |
| --- | --- |
| Nom, adresse, téléphone, horaires | `.env` |
| Taux et durée des mensualités affichées | `src/lib/utils.ts` |
| Véhicules en stock | l’espace garage `/admin` (plus besoin de toucher au code) |
| Photos de l’accueil et de la reprise | `src/data/images.ts` |
| SIRET / ORIAS, mentions légales | `src/components/sections/Footer.tsx` |
| Avis clients (actuellement des exemples) | `src/components/sections/Reviews.tsx` |

## À compléter avant la mise en ligne

- Vérifier les coordonnées reprises des annuaires en ligne : zone artisanale, rue du Mans, 72240 Bernay-en-Champagne · 02 43 20 74 34 · horaires (les annuaires ne sont pas d’accord sur l’heure de fermeture).
- SIRET et numéro ORIAS (obligatoire si le garage propose du crédit comme intermédiaire).
- Ajouter les vrais véhicules et leurs photos depuis `/admin` une fois le site en ligne.
- Vrais avis clients et vraie note moyenne.
- Les formulaires (reprise, recherche) fonctionnent dans la page mais n’envoient encore rien : il faut les relier à un e-mail ou à un outil de gestion.
