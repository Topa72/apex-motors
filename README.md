# Garage Citroën

Site vitrine d’un garage Citroën qui fait aussi la vente de véhicules d’occasion : annonces filtrables, simulateur de mensualité, atelier, reprise, avis et contact.

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
| Nom du garage, téléphone, taux et durée des mensualités affichées | `src/lib/utils.ts` |
| Véhicules en stock (prix, km, carburant, garantie…) | `src/data/inventory.ts` |
| Photos (accueil, reprise, annonces) | `src/data/images.ts` + dossier `public/photos/` |
| Adresse, horaires, SIRET / ORIAS, mentions légales | `src/components/sections/Footer.tsx` |
| Horaires de l’atelier, prestations | `src/components/sections/Service.tsx` |
| Avis clients (actuellement des exemples) | `src/components/sections/Reviews.tsx` |

## À compléter avant la mise en ligne

- Vraies coordonnées : adresse, téléphone (le 01 99 00 45 12 est un numéro fictif), horaires.
- SIRET et numéro ORIAS (obligatoire si le garage propose du crédit comme intermédiaire).
- Photos réelles des véhicules : sans photo, chaque annonce affiche un visuel neutre avec le nom du modèle.
- Vrais avis clients et vraie note moyenne.
- Les formulaires (reprise, recherche) fonctionnent dans la page mais n’envoient encore rien : il faut les relier à un e-mail ou à un outil de gestion.
