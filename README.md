## Melodix

Application web **full‑stack** pour une boutique musicale (frontend React/Vite + backend Express) avec une couche **d’authentification**, un **catalogue produits** et un formulaire **contact**.

### Lien de production

- **Site en production**: `https://melodix-nine.vercel.app`

### Stack technique

- **Frontend**: React 19, Vite, Tailwind CSS
- **Backend**: Node.js, Express, JWT, Nodemailer
- **Données**:
  - **MongoDB** (Mongoose) — comptes / auth (selon les modèles)
  - **PostgreSQL** (`pg`) — catalogue produits (et/ou données relationnelles)
- **Conteneurisation (dev)**: Docker Compose (client `5173`, API `3000`)
- **Déploiement frontend**: Vercel (rewrite SPA)

### Structure du projet (backend + frontend)

```text
Melodix/
├── melodix-server/                 # Backend Express.js (API)
│   ├── index.js                    # Point d’entrée (Express + routes /api/*)
│   ├── DB/                         # Connexions bases de données
│   │   ├── mongoDB.js              # Connexion MongoDB (Mongoose)
│   │   └── postgres.js             # Connexion PostgreSQL / Supabase (pg)
│   ├── controllers/                # Logique métier (auth, produits, contact)
│   ├── routes/                     # Routes API (auth, contact, products)
│   ├── models/                     # Schémas / modèles (Mongoose, etc.)
│   ├── template/                   # Templates emails (reset, contact, ...)
│   ├── sql_scripts/                # Scripts SQL (init DB PostgreSQL)
│   └── dockerfile                  # Image Docker du backend
│
├── melodix-client/                 # Frontend React + Vite
│   ├── src/
│   │   ├── components/             # Composants UI
│   │   ├── pages/                  # Pages (routes côté React)
│   │   ├── context/                # Context (Auth, Cart, Wishlist, Toast)
│   │   ├── utils/                  # Helpers (ex: appels API)
│   │   ├── layouts/                # Layouts
│   │   └── data/                   # Données statiques / seed (si utilisé)
│   ├── public/                     # Assets statiques
│   ├── vite.config.js              # Config Vite (port 5173, alias @)
│   └── vercel.json                 # Rewrite SPA pour Vercel
│
├── docker-compose.yml              # Lancement dev multi‑services (5173 / 3000)
├── Diagrammes /                    # Diagrammes BD (attention: espace final)
└── README.md
```

### Prérequis

- **Node.js 22+** (recommandé, aligné avec l’image Docker `node:22-alpine`)
- **npm**
- Accès à une instance **MongoDB**
- Accès à une instance **PostgreSQL** (ou Supabase via `DATABASE_URL`)

## Démarrage rapide (sans Docker)

### 1) Backend (API)

```bash
cd melodix-server
npm install
npm run dev
```

L’API démarre sur `http://localhost:3000` (par défaut).

### 2) Frontend

```bash
cd melodix-client
npm install
npm run dev
```

Le site démarre sur `http://localhost:5173`.

## Démarrage avec Docker (dev)

Depuis la racine:

```bash
docker compose up --build
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

## Variables d’environnement (backend)

Le backend charge un fichier `.env` situé dans `melodix-server/.env`.

Variables attendues:

- **MongoDB**
  - `MONGODB_URI`
- **PostgreSQL**
  - Option A (recommandée en hébergement type Supabase): `DATABASE_URL`
  - Option B (paramètres séparés):
    - `POSTGRES_HOST`
    - `POSTGRES_PORT`
    - `POSTGRES_DB`
    - `POSTGRES_USER`
    - `POSTGRES_PASSWORD`
- **API**
  - `PORT` (optionnel, défaut `3000`)

> Note: la connexion PostgreSQL est configurée avec SSL (`rejectUnauthorized: false`) pour compatibilité Supabase.

## API (routes principales)

Préfixe: `http://localhost:3000`

- **Auth** (`/api/auth`)
  - `POST /register`
  - `POST /login`
  - `POST /forgot-password`
  - `POST /reset-password`
- **Contact** (`/api/contact`)
  - `POST /`
- **Produits** (`/api/products`)
  - `GET /` (liste)
  - `GET /:slug` (détail)

## Diagrammes

Les diagrammes sont dans le dossier `Diagrammes ` (avec un espace à la fin).  
Si vous rencontrez des soucis de chemin selon l’OS/outils, renommez le dossier sans espace final.

