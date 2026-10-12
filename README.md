# Garage de la Champagne

Site de vente de véhicules d’occasion du Garage de la Champagne (réparateur agréé Citroën, Bernay-en-Champagne, Sarthe) : annonces filtrables, simulateur de mensualité, reprise, étapes d’achat, avis et contact.

**Technique :** React 19 · Vite · TypeScript · Tailwind CSS 3 · Motion (`motion/react`) · composants Radix au format shadcn (Slider, Select, Dialog) · lucide-react

## Lancer le site

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # vérification TypeScript + build de production
npm run preview  # sert le build
npm run lint     # oxlint
```

## Où modifier quoi

| À changer | Fichier |
| --- | --- |
| Nom, adresse, téléphone, horaires, taux et durée des mensualités | `src/lib/utils.ts` (ou variables `VITE_*` dans un fichier `.env`) |
| Véhicules en stock (prix, km, carburant, garantie…) | `src/data/inventory.ts` |
| Photos (accueil, reprise, annonces) | `src/data/images.ts` + dossier `public/photos/` |
| SIRET / ORIAS, mentions légales | `src/components/sections/Footer.tsx` |
| Avis clients (actuellement des exemples) | `src/components/sections/Reviews.tsx` |

## À compléter avant la mise en ligne

- Vérifier les coordonnées reprises des annuaires en ligne : zone artisanale, rue du Mans, 72240 Bernay-en-Champagne · 02 43 20 74 34 · horaires (les annuaires ne sont pas d’accord sur l’heure de fermeture).
- SIRET et numéro ORIAS (obligatoire si le garage propose du crédit comme intermédiaire).
- Photos réelles des véhicules : sans photo, chaque annonce affiche un visuel neutre avec le nom du modèle.
- Vrais avis clients et vraie note moyenne.
- Les formulaires (reprise, recherche) fonctionnent dans la page mais n’envoient encore rien : il faut les relier à un e-mail ou à un outil de gestion.
