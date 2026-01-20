# Food Engineer Portfolio Platform

Une application web moderne et bilingue (EN/TR) conçue pour présenter un portfolio de Recherche & Développement alimentaire ainsi que des publications scientifiques.

Le projet se distingue par une architecture optimisée pour la performance (Core Web Vitals), une gestion fine des assets graphiques et une expérience utilisateur fluide grâce à des animations réactives.

## 🛠 Stack Technique

### Core & Build
* **Framework :** React 18
* **Langage :** TypeScript
* **Build Tool :** Vite
* **Routing :** React Router DOM v6

### UI & UX
* **Styling :** Tailwind CSS
* **Animations :** Framer Motion (Transitions, Parallax, Liquid Background)
* **Icons :** Lucide React

### Data & Internationalisation
* **CMS Headless :** Sanity.io
* **Internationalisation :** i18next (Détection de langue & traduction JSON)

---

## ⚡ Architecture & Optimisations

Le projet implémente plusieurs stratégies avancées pour garantir une fluidité maximale malgré l'utilisation d'animations lourdes (Canvas/SVG).

### 1. Stratégie "Waterfall Loading"
Pour éviter le blocage du *Main Thread* (TBT) au chargement initial :
1.  **Immédiat :** Rendu de la structure HTML/CSS critique (Navbar, Hero Text).
2.  **Rapide (<500ms) :** Hydratation des données dynamiques (Projets, Articles).
3.  **Différé (Idle) :** Chargement du `LiquidBackground` (animation d'arrière-plan gourmande en ressources) uniquement après stabilisation du navigateur, via `setTimeout` et `Framer Motion`.

### 2. Gestion Avancée des Médias (Sanity CDN)
Les images sont optimisées dynamiquement via l'API de transformation de Sanity :
* **Format Next-Gen :** Conversion automatique en WebP (`auto=format`).
* **Responsive Fetching :** Les requêtes API demandent la taille exacte nécessaire (`.width()`, `.height()`) selon le contexte (Mobile vs Desktop) pour économiser la bande passante.
* **Layouts Hybrides :**
    * *Mobile :* Header fusionné (Titre + Vignette compacte) pour maximiser l'espace écran.
    * *Desktop :* Mise en page "Vitrine" avec images haute résolution flottantes.

---

## 📝 Gestion du Contenu (CMS Schema)

La structure de données (Sanity Studio) est modélisée pour offrir une flexibilité totale à l'éditeur :

### Portfolio (Drinks)
* Champs techniques dédiés (pH, Brix, Ingrédients).
* Gestion des images avec *Hotspot* pour un recadrage intelligent sans perte du sujet principal.

### Lab Journal (Blog)
* **Portable Text Customisé :** Moteur de rendu de texte riche réécrit pour supporter des composants React (Titres stylisés, Listes, Citations).
* **Insertion d'Images Intelligente :** L'éditeur peut choisir la taille d'affichage de l'image dans l'article (*Normal, Wide, Small*), ce qui adapte automatiquement le CSS et la requête CDN côté frontend.

---

## 📂 Structure du Projet

L'architecture suit une séparation claire des responsabilités :

```bash
src/
├── components/      # Composants UI atomiques et moléculaires
├── pages/           # Vues principales et logique de page
├── services/        # Client Sanity et fonctions de fetch typées
├── types/           # Interfaces TypeScript (DTOs)
├── locales/         # Fichiers de traduction
└── App.tsx          # Orchestration du routing et logique de chargement