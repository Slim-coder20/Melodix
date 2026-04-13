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

### Architecture (schéma)

```mermaid
flowchart LR
  U[Utilisateur / Navigateur] -->|HTTPS| V[Vercel\nmelodix-nine.vercel.app]
  V -->|SPA React (Vite build)| FE[Frontend\nReact + Tailwind]

  FE -->|HTTP(S) /api/*| API[Backend API\nNode.js + Express\n:3000]

  API -->|Mongoose| MDB[(MongoDB)]
  API -->|pg Pool| PDB[(PostgreSQL\nou Supabase via DATABASE_URL)]

  API -->|SMTP| MAIL[(Nodemailer / Email provider)]
```

### Structure du dépôt

- `melodix-client/`: application frontend (React/Vite)
- `melodix-server/`: API backend (Express)
  - `index.js`: point d’entrée (montage des routes `/api/auth`, `/api/contact`, `/api/products`)
  - `routes/`: routes Express
  - `controllers/`: logique métier
  - `DB/`: connexions MongoDB + PostgreSQL
  - `sql_scripts/`: scripts SQL d’initialisation
- `docker-compose.yml`: environnement de développement multi‑services
- `Diagrammes /`: diagrammes de base de données (attention: le nom du dossier contient un espace final)

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

