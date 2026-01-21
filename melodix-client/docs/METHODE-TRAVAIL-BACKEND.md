# Documentation : Méthode de Travail - Backend Harmony

## 📋 Table des matières
1. [Analyse de l'existant](#analyse-de-lexistant)
2. [Architecture hybride PostgreSQL + NoSQL](#architecture-hybride-postgresql--nosql)
3. [Structure PostgreSQL (Catalogue & Stocks)](#structure-postgresql-catalogue--stocks)
4. [Structure NoSQL MongoDB (Utilisateurs & Favoris)](#structure-nosql-mongodb-utilisateurs--favoris)
5. [Architecture backend recommandée](#architecture-backend-recommandée)
6. [Plan de migration](#plan-de-migration)
7. [Méthode de travail étape par étape](#méthode-de-travail-étape-par-étape)

---

## 🔍 Analyse de l'existant

### Structure actuelle du projet

#### Frontend (React + Vite)
- **Données mockées** : Tous les produits sont stockés dans des fichiers JavaScript (`src/data/`)
  - `guitares.js`, `basse.js`, `effets.js`, `batterie.js`, `pianoClavier.js`, `homeStudio.js`, `home.js`
- **Contextes React** :
  - `CartContext` : Gestion du panier (localStorage)
  - `WishlistContext` : Gestion des favoris (localStorage)
  - `AuthContext` : En cours de création (incomplet)
  - `ToastContext` : Notifications
- **Pages principales** :
  - Pages produits, panier, wishlist, authentification
  - Pas de gestion de commandes côté backend

#### Backend (Express.js)
- **Serveur minimal** : `server.js` avec une seule route `/products`
- **Base de données** : MariaDB via Docker (à migrer vers PostgreSQL + MongoDB)
- **Connexion** : Pool MySQL2 configuré (à remplacer)

#### Base de données SQL actuelle
- **4 tables existantes** :
  1. `categories` : Catégories de produits
  2. `products` : Produits
  3. `stocks` : Entrepôts/magasins
  4. `stock_product` : Table de liaison (many-to-many)

### Structure des données frontend analysée

Chaque produit contient :
```javascript
{
  id: "string-unique",
  brand: "string",
  model: "string",
  category: "string", // electrique, acoustique, classique, fretless, etc.
  price: number,
  monthly: number,
  image: "string-path",
  stock: ["array", "of", "strings"], // Noms de stocks
  badge: "string" // TOP VENTES, NOUVEAUTÉ, etc.
}
```

**Catégories identifiées** :
- `electrique`, `acoustique`, `classique` (guitares)
- `electrique`, `fretless` (basses)
- `effetbasse`, `effetguitare` (effets)
- `batterie`, `piano`, `clavier`, `homestudio`, `sonorisation`, `amplis`

---

## 🏗️ Architecture hybride PostgreSQL + NoSQL

### Choix architectural : Base de données hybride

**PostgreSQL** (Relationnel) pour :
- ✅ **Produits** : Données structurées avec relations complexes
- ✅ **Catégories** : Hiérarchie et relations
- ✅ **Stocks** : Gestion transactionnelle des quantités
- ✅ **Stock_Product** : Relations many-to-many avec quantités
- ✅ **Commandes** : Transactions critiques nécessitant l'ACID

**MongoDB** (NoSQL) pour :
- ✅ **Utilisateurs** : Données flexibles, évolutives
- ✅ **Authentification** : Tokens, sessions, reset password
- ✅ **Wishlist/Favoris** : Collections simples, accès rapide
- ✅ **Adresses** : Documents flexibles par utilisateur

### Avantages de cette architecture

#### PostgreSQL pour le catalogue
- **Intégrité référentielle** : Relations strictes entre produits, catégories, stocks
- **Transactions ACID** : Gestion fiable des stocks et commandes
- **Requêtes complexes** : Jointures, agrégations, recherche full-text
- **Normalisation** : Structure optimisée pour les données relationnelles

#### MongoDB pour les utilisateurs
- **Flexibilité** : Schéma évolutif pour les profils utilisateurs
- **Performance** : Accès rapide aux données utilisateur
- **Scalabilité** : Facile à sharder pour de nombreux utilisateurs
- **Simplicité** : Collections simples pour wishlist, favoris

### Structure des connexions

```
Express.js Backend
    ├── PostgreSQL Client (pg ou Prisma)
    │   └── Catalogue, Stocks, Commandes
    │
    └── MongoDB Client (mongoose ou mongodb)
        └── Users, Wishlist, Sessions
```

---

## ⚠️ Problèmes identifiés

### 1. **Structure SQL incomplète**
- ❌ Pas de table `users` pour l'authentification
- ❌ Pas de table `orders` pour les commandes
- ❌ Pas de table `order_items` pour les lignes de commande
- ❌ Pas de table `wishlist` pour les favoris utilisateurs
- ❌ Pas de table `addresses` pour les adresses de livraison
- ❌ Pas de gestion des tokens d'authentification

### 2. **Problèmes de normalisation**
- ❌ Table `products` : `badge` en VARCHAR(100) alors que c'est une énumération (TOP VENTES, NOUVEAUTÉ, null)
- ❌ Table `products` : `image` en VARCHAR(100) trop court pour les chemins complets
- ❌ Table `categories` : `description` en VARCHAR(100) mais souvent vide
- ❌ Pas de gestion des quantités en stock (seulement présence/absence)
- ❌ Pas de timestamps (created_at, updated_at)

### 3. **Incohérences données**
- ❌ Les catégories frontend ne correspondent pas aux catégories SQL
- ❌ Les IDs produits frontend sont des strings, SQL utilise des INT
- ❌ Le champ `monthly` (mensualité) n'est pas dans la table SQL actuelle

### 4. **Manques fonctionnels**
- ❌ Pas de gestion des avis clients
- ❌ Pas de gestion des codes promo
- ❌ Pas de gestion de l'historique des commandes
- ❌ Pas de gestion des rôles utilisateurs (admin, client)

---

## 🗄️ Structure PostgreSQL (Catalogue & Stocks)

### Schéma PostgreSQL pour le catalogue

#### **1. Table `categories`** (Catégories de produits)
```sql
CREATE TABLE categories (
    id SMALLINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE, -- Pour les URLs (ex: "guitares-electriques")
    description TEXT, -- TEXT au lieu de VARCHAR(100)
    parent_id SMALLINT NULL, -- Pour les catégories hiérarchiques (ex: Guitares > Électriques)
    image VARCHAR(255) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_category_parent FOREIGN KEY (parent_id) 
        REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_slug (slug),
    INDEX idx_parent_id (parent_id)
);
```

#### **2. Table `products`** (Produits)
```sql
CREATE TABLE products (
    id INT NOT NULL AUTO_INCREMENT,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE, -- Pour les URLs (ex: "fender-st80-sunburst")
    id_category SMALLINT NOT NULL,
    price DECIMAL(10, 2) NOT NULL, -- DECIMAL au lieu de FLOAT pour précision
    monthly DECIMAL(10, 2) NULL, -- Ajout du champ monthly
    badge ENUM('TOP VENTES', 'NOUVEAUTÉ', 'PROMO', NULL) DEFAULT NULL, -- ENUM au lieu de VARCHAR
    image VARCHAR(500) NOT NULL, -- VARCHAR(500) au lieu de VARCHAR(100)
    description TEXT,
    specifications JSON, -- Pour stocker les spécifications flexibles
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_product_category FOREIGN KEY (id_category) 
        REFERENCES categories(id) ON DELETE RESTRICT,
    INDEX idx_category (id_category),
    INDEX idx_slug (slug),
    INDEX idx_badge (badge),
    INDEX idx_brand (brand),
    FULLTEXT INDEX idx_search (brand, model, description) -- Pour la recherche
);
```

#### **3. Table `stocks`** (Entrepôts/Magasins)
```sql
CREATE TABLE stocks (
    id SMALLINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    type ENUM('magasin', 'entrepot', 'internet') NOT NULL,
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);
```

#### **4. Table `stock_product`** (Stock des produits)
```sql
CREATE TABLE stock_product (
    stock_id SMALLINT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 0, -- Quantité en stock
    reserved_quantity INT DEFAULT 0, -- Quantité réservée (paniers non finalisés)
    min_threshold INT DEFAULT 5, -- Seuil d'alerte stock faible
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (stock_id, product_id),
    CONSTRAINT fk_stock_product_stock FOREIGN KEY (stock_id) 
        REFERENCES stocks(id) ON DELETE CASCADE,
    CONSTRAINT fk_stock_product_product FOREIGN KEY (product_id) 
        REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_quantity (quantity)
);
```

#### **5. Table `orders`** (Commandes)
```sql
CREATE TABLE orders (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    order_number VARCHAR(50) NOT NULL UNIQUE, -- Numéro de commande unique (ex: CMD-2024-001234)
    status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    subtotal DECIMAL(10, 2) NOT NULL,
    vat DECIMAL(10, 2) NOT NULL, -- TVA
    shipping DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    shipping_address_id INT NOT NULL,
    billing_address_id INT NOT NULL,
    payment_method ENUM('card', 'paypal', 'bank_transfer') NULL,
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    -- Note: user_id référence MongoDB users._id (pas de FK car base différente)
    shipping_address JSONB NOT NULL, -- Adresse complète en JSON (depuis MongoDB)
    billing_address JSONB NOT NULL, -- Adresse complète en JSON (depuis MongoDB)
    INDEX idx_user_id (user_id),
    INDEX idx_order_number (order_number),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);
```

#### **6. Table `order_items`** (Lignes de commande)
```sql
CREATE TABLE order_items (
    id INT NOT NULL AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL, -- Prix au moment de la commande (historique)
    total_price DECIMAL(10, 2) NOT NULL, -- quantity * unit_price
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_order_item_order FOREIGN KEY (order_id) 
        REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_item_product FOREIGN KEY (product_id) 
        REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
);
```

---

## 🍃 Structure NoSQL MongoDB (Utilisateurs & Favoris)

### Collections MongoDB

#### **1. Collection `users`** (Utilisateurs)
```javascript
{
  _id: ObjectId,
  email: String (unique, indexé),
  passwordHash: String,
  nom: String,
  prenom: String,
  telephone: String,
  role: String, // "client" | "admin"
  isActive: Boolean,
  addresses: [
    {
      type: String, // "livraison" | "facturation"
      adresse: String,
      codePostal: String,
      ville: String,
      pays: String,
      isDefault: Boolean
    }
  ],
  resetPasswordToken: String, // Pour reset password
  resetPasswordExpires: Date,
  emailVerificationToken: String,
  emailVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Index MongoDB** :
```javascript
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ resetPasswordToken: 1 })
db.users.createIndex({ emailVerificationToken: 1 })
```

#### **2. Collection `wishlist`** (Favoris)
```javascript
{
  _id: ObjectId,
  userId: ObjectId (référence vers users._id, indexé),
  productId: Number (référence vers products.id PostgreSQL),
  createdAt: Date
}
```

**Index MongoDB** :
```javascript
db.wishlist.createIndex({ userId: 1, productId: 1 }, { unique: true })
db.wishlist.createIndex({ userId: 1 })
db.wishlist.createIndex({ productId: 1 })
```

#### **3. Collection `sessions`** (Sessions utilisateurs - Optionnel)
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  token: String (indexé),
  refreshToken: String,
  expiresAt: Date,
  ipAddress: String,
  userAgent: String,
  createdAt: Date
}
```

**Index MongoDB** :
```javascript
db.sessions.createIndex({ token: 1 }, { unique: true })
db.sessions.createIndex({ userId: 1 })
db.sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }) // TTL
```

#### **4. Collection `password_resets`** (Tokens de réinitialisation)
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  token: String (indexé),
  expiresAt: Date,
  used: Boolean,
  createdAt: Date
}
```

**Index MongoDB** :
```javascript
db.password_resets.createIndex({ token: 1 }, { unique: true })
db.password_resets.createIndex({ userId: 1 })
db.password_resets.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }) // TTL
```

### Avantages de MongoDB pour les utilisateurs

1. **Flexibilité du schéma** : Facile d'ajouter de nouveaux champs aux profils
2. **Adresses imbriquées** : Les adresses sont directement dans le document utilisateur
3. **Performance** : Accès rapide aux données utilisateur sans jointures
4. **Scalabilité** : Facile à sharder pour de nombreux utilisateurs
5. **TTL automatique** : Expiration automatique des tokens avec index TTL

### Relation PostgreSQL ↔ MongoDB

**Liaison entre les deux bases** :
- `wishlist.productId` → `products.id` (PostgreSQL)
- `orders.userId` → `users._id` (MongoDB) - stocké comme String dans PostgreSQL
- Les commandes restent en PostgreSQL pour l'intégrité transactionnelle

---

## 📊 Table `reviews`** (Avis clients - Optionnel, PostgreSQL)
```sql
CREATE TABLE reviews (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE, -- Modération
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    -- Note: user_id référence MongoDB users._id (pas de FK car base différente)
    CONSTRAINT fk_review_product FOREIGN KEY (product_id) 
        REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product_review (user_id, product_id), -- Un utilisateur = un avis par produit
    INDEX idx_product_id (product_id),
    INDEX idx_rating (rating),
    INDEX idx_is_approved (is_approved)
);
```

#### **11. Table `promo_codes`** (Codes promo - Optionnel)
```sql
CREATE TABLE promo_codes (
    id INT NOT NULL AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,
    type ENUM('percentage', 'fixed') NOT NULL,
    value DECIMAL(10, 2) NOT NULL,
    min_purchase DECIMAL(10, 2) DEFAULT 0,
    max_discount DECIMAL(10, 2) NULL,
    usage_limit INT NULL, -- Nombre d'utilisations max
    used_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    valid_from TIMESTAMP NOT NULL,
    valid_until TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_code (code),
    INDEX idx_is_active (is_active)
);
```

---

## 🏗️ Architecture backend recommandée

### Structure de dossiers proposée

```
harmony-app/
├── server/
│   ├── config/
│   │   ├── postgresql.js        # Configuration PostgreSQL
│   │   └── mongodb.js            # Configuration MongoDB
│   ├── controllers/
│   │   ├── authController.js    # MongoDB (users)
│   │   ├── productController.js # PostgreSQL
│   │   ├── orderController.js   # PostgreSQL
│   │   ├── userController.js    # MongoDB
│   │   └── wishlistController.js # MongoDB
│   ├── middleware/
│   │   ├── auth.js              # Vérification JWT
│   │   ├── errorHandler.js
│   │   └── validate.js           # Validation des données
│   ├── models/
│   │   ├── mongodb/
│   │   │   ├── User.js          # Modèle Mongoose
│   │   │   ├── Wishlist.js      # Modèle Mongoose
│   │   │   └── Session.js       # Modèle Mongoose
│   │   └── postgresql/
│   │       ├── Product.js       # Prisma ou pg
│   │       ├── Order.js
│   │       └── ...
│   ├── routes/
│   │   ├── auth.js              # Routes MongoDB
│   │   ├── products.js          # Routes PostgreSQL
│   │   ├── orders.js            # Routes PostgreSQL
│   │   ├── users.js             # Routes MongoDB
│   │   └── wishlist.js          # Routes MongoDB
│   ├── services/
│   │   ├── authService.js       # MongoDB
│   │   ├── productService.js    # PostgreSQL
│   │   └── orderService.js      # PostgreSQL
│   ├── utils/
│   │   ├── jwt.js
│   │   ├── bcrypt.js
│   │   └── validators.js
│   ├── server.js                # Point d'entrée
│   └── package.json
├── sql_scripts/
│   ├── init-v003-postgresql.sql  # Schéma PostgreSQL complet
│   ├── migrations/
│   │   ├── 001_migrate_from_mariadb.sql
│   │   └── ...
│   └── seeds/
│       ├── categories.sql
│       ├── products.sql
│       └── ...
└── ...
```

### Technologies recommandées

- **Backend** : Express.js (déjà utilisé)
- **Base de données relationnelle** : PostgreSQL (migration depuis MariaDB)
- **Base de données NoSQL** : MongoDB
- **ORM PostgreSQL** : Prisma (déjà installé) OU pg (client natif)
- **ODM MongoDB** : Mongoose (recommandé) OU mongodb (client natif)
- **Authentification** : JWT (jsonwebtoken)
- **Validation** : Joi ou express-validator
- **Sécurité** : bcrypt pour les mots de passe, helmet pour les headers

---

## 📦 Plan de migration

### Phase 1 : Préparation des bases de données
1. ✅ Créer le nouveau schéma PostgreSQL (`init-v003-postgresql.sql`)
2. ✅ Configurer MongoDB et créer les collections
3. ✅ Créer les scripts de migration depuis MariaDB vers PostgreSQL
4. ✅ Créer les scripts de seed pour les données initiales (PostgreSQL)
5. ✅ Créer les index MongoDB

### Phase 2 : Migration des données frontend → SQL
1. ✅ Analyser tous les fichiers `src/data/*.js`
2. ✅ Créer un script Node.js pour migrer les produits vers SQL
3. ✅ Mapper les catégories frontend vers les catégories SQL
4. ✅ Générer les slugs pour les produits et catégories

### Phase 3 : Backend - Authentification (MongoDB)
1. ✅ Configurer la connexion MongoDB
2. ✅ Créer les modèles Mongoose pour `users` et `sessions`
3. ✅ Créer les routes d'authentification (`/api/auth/login`, `/api/auth/register`, `/api/auth/reset-password`)
4. ✅ Implémenter JWT
5. ✅ Créer le middleware d'authentification
6. ✅ Connecter `AuthContext` frontend avec le backend

### Phase 4 : Backend - Produits
1. ✅ Créer les routes produits (`/api/products`)
2. ✅ Implémenter la recherche et les filtres
3. ✅ Remplacer les données mockées frontend par des appels API

### Phase 5 : Backend - Panier et Commandes
1. ✅ Créer les routes panier (`/api/cart`) - optionnel (peut rester localStorage)
2. ✅ Créer les routes commandes (`/api/orders`)
3. ✅ Implémenter la création de commande depuis le panier
4. ✅ Gérer les stocks lors de la commande

### Phase 6 : Backend - Wishlist (MongoDB)
1. ✅ Créer le modèle Mongoose pour `wishlist`
2. ✅ Créer les routes wishlist (`/api/wishlist`)
3. ✅ Connecter `WishlistContext` avec le backend MongoDB
4. ✅ Migrer les wishlists localStorage vers MongoDB

### Phase 7 : Tests et optimisations
1. ✅ Tests des endpoints
2. ✅ Optimisation des requêtes SQL
3. ✅ Gestion des erreurs
4. ✅ Documentation API

---

## 📝 Méthode de travail étape par étape

### ÉTAPE 1 : Créer le schéma SQL complet

**Objectif** : Avoir une base de données complète et normalisée

**Actions** :
1. Créer `sql_scripts/init-v003.sql` avec toutes les tables
2. Tester le schéma dans une base de données de test
3. Vérifier les contraintes et index
4. Documenter les relations entre tables

**Livrable** : Fichier SQL prêt à être exécuté

---

### ÉTAPE 2 : Créer les scripts de migration

**Objectif** : Migrer les données existantes vers le nouveau schéma

**Actions** :
1. Créer `sql_scripts/migrations/001_migrate_categories.sql`
   - Migrer les catégories existantes
   - Ajouter les nouvelles catégories manquantes
2. Créer `sql_scripts/migrations/002_migrate_products.sql`
   - Migrer les produits existants
   - Ajouter les champs manquants (monthly, slug, description)
3. Créer `sql_scripts/migrations/003_migrate_stocks.sql`
   - Migrer les stocks existants
   - Ajouter les quantités en stock

**Livrable** : Scripts de migration testés

---

### ÉTAPE 3 : Créer un script de migration des données frontend

**Objectif** : Importer tous les produits depuis les fichiers JS vers SQL

**Actions** :
1. Créer `scripts/migrate-products-to-db.js`
2. Lire tous les fichiers `src/data/*.js`
3. Pour chaque produit :
   - Trouver ou créer la catégorie correspondante
   - Générer un slug unique
   - Insérer le produit dans la base
   - Associer les stocks
4. Gérer les doublons et erreurs

**Livrable** : Script Node.js exécutable qui remplit la base de données

---

### ÉTAPE 4 : Structurer le backend Express

**Objectif** : Organiser le code backend de manière professionnelle

**Actions** :
1. Créer la structure de dossiers (`server/controllers`, `server/routes`, etc.)
2. Séparer `server.js` en modules
3. Créer un fichier de configuration pour la base de données
4. Créer un middleware de gestion d'erreurs global

**Livrable** : Structure backend organisée

---

### ÉTAPE 5 : Implémenter l'authentification backend

**Objectif** : Permettre aux utilisateurs de s'inscrire et se connecter

**Actions** :
1. Installer les dépendances : `jsonwebtoken`, `bcrypt`
2. Créer `server/controllers/authController.js` :
   - `register()` : Inscription
   - `login()` : Connexion
   - `logout()` : Déconnexion (optionnel)
   - `refreshToken()` : Renouvellement du token
3. Créer `server/middleware/auth.js` : Vérification JWT
4. Créer `server/routes/auth.js` : Routes `/api/auth/*`
5. Tester avec Postman ou Thunder Client

**Livrable** : API d'authentification fonctionnelle

---

### ÉTAPE 6 : Connecter AuthContext frontend avec backend

**Objectif** : Remplacer les mocks par de vrais appels API

**Actions** :
1. Compléter `src/context/AuthContext.jsx` :
   - Implémenter `register()` avec appel API
   - Implémenter `login()` avec appel API
   - Gérer le stockage du token
   - Gérer la restauration de session au chargement
2. Modifier `src/pages/connexion/Login.jsx` pour utiliser le contexte
3. Modifier `src/pages/connexion/Register.jsx` pour utiliser le contexte
4. Tester le flux complet

**Livrable** : Authentification frontend-backend connectée

---

### ÉTAPE 7 : Implémenter les routes produits backend

**Objectif** : Remplacer les données mockées par des appels API

**Actions** :
1. Créer `server/controllers/productController.js` :
   - `getAllProducts()` : Liste avec pagination, filtres
   - `getProductById()` : Détails d'un produit
   - `searchProducts()` : Recherche full-text
   - `getProductsByCategory()` : Par catégorie
2. Créer `server/routes/products.js` : Routes `/api/products/*`
3. Créer un service de requêtes SQL optimisées
4. Tester les endpoints

**Livrable** : API produits fonctionnelle

---

### ÉTAPE 8 : Remplacer les données mockées frontend

**Objectif** : Le frontend utilise maintenant l'API

**Actions** :
1. Créer `src/services/api.js` : Client API centralisé
2. Créer `src/hooks/useProducts.js` : Hook pour récupérer les produits
3. Modifier les composants qui utilisent `allProducts` :
   - `src/pages/Product.jsx`
   - `src/pages/Order.jsx`
   - `src/components/ProductCard.jsx`
   - etc.
4. Gérer les états de chargement et erreurs

**Livrable** : Frontend connecté à l'API produits

---

### ÉTAPE 9 : Implémenter les routes commandes backend

**Objectif** : Permettre la création de commandes

**Actions** :
1. Créer `server/controllers/orderController.js` :
   - `createOrder()` : Créer une commande depuis le panier
   - `getUserOrders()` : Historique des commandes
   - `getOrderById()` : Détails d'une commande
   - `updateOrderStatus()` : Changer le statut (admin)
2. Créer `server/routes/orders.js` : Routes `/api/orders/*`
3. Implémenter la logique de gestion des stocks
4. Générer les numéros de commande uniques

**Livrable** : API commandes fonctionnelle

---

### ÉTAPE 10 : Connecter le panier avec les commandes

**Objectif** : Permettre de passer commande depuis le panier

**Actions** :
1. Modifier `src/pages/Order.jsx` :
   - Ajouter un formulaire d'adresse de livraison
   - Appeler l'API pour créer la commande
   - Vider le panier après commande réussie
   - Afficher la confirmation
2. Créer une page de confirmation de commande
3. Gérer les erreurs (stock insuffisant, etc.)

**Livrable** : Flux de commande complet

---

### ÉTAPE 11 : Implémenter les routes wishlist backend

**Objectif** : Sauvegarder les favoris en base de données

**Actions** :
1. Créer `server/controllers/wishlistController.js` :
   - `getUserWishlist()` : Récupérer la wishlist
   - `addToWishlist()` : Ajouter un produit
   - `removeFromWishlist()` : Retirer un produit
2. Créer `server/routes/wishlist.js` : Routes `/api/wishlist/*`
3. Modifier `src/context/WishlistContext.jsx` pour utiliser l'API
4. Migrer les wishlists localStorage vers SQL (au login)

**Livrable** : Wishlist persistée en base de données

---

### ÉTAPE 12 : Gestion des stocks

**Objectif** : Gérer les quantités en stock et les réservations

**Actions** :
1. Créer `server/services/stockService.js` :
   - `checkAvailability()` : Vérifier la disponibilité
   - `reserveStock()` : Réserver du stock (panier)
   - `releaseStock()` : Libérer du stock (panier abandonné)
   - `updateStock()` : Mettre à jour après commande
2. Intégrer dans le processus de commande
3. Afficher les stocks sur les pages produits
4. Gérer les alertes stock faible

**Livrable** : Gestion des stocks fonctionnelle

---

### ÉTAPE 13 : Tests et optimisations

**Objectif** : S'assurer que tout fonctionne correctement

**Actions** :
1. Tester tous les endpoints avec Postman
2. Tester les scénarios d'erreur
3. Optimiser les requêtes SQL (ajouter des index si nécessaire)
4. Vérifier les performances
5. Documenter l'API (Swagger ou README)

**Livrable** : Application testée et optimisée

---

## 🎯 Checklist de progression

### Base de données
- [ ] Schéma SQL complet créé (`init-v003.sql`)
- [ ] Scripts de migration créés
- [ ] Script de migration données frontend → SQL créé
- [ ] Base de données testée et validée

### Backend - Structure
- [ ] Structure de dossiers créée
- [ ] Configuration base de données centralisée
- [ ] Middleware d'erreurs global créé

### Backend - Authentification
- [ ] Routes d'authentification créées
- [ ] JWT implémenté
- [ ] Middleware d'authentification créé
- [ ] Tests des endpoints auth

### Backend - Produits
- [ ] Routes produits créées
- [ ] Recherche et filtres implémentés
- [ ] Tests des endpoints produits

### Backend - Commandes
- [ ] Routes commandes créées
- [ ] Gestion des stocks intégrée
- [ ] Tests des endpoints commandes

### Backend - Wishlist
- [ ] Routes wishlist créées
- [ ] Tests des endpoints wishlist

### Frontend - Authentification
- [ ] AuthContext complété et connecté
- [ ] Pages Login/Register connectées
- [ ] Gestion des routes protégées

### Frontend - Produits
- [ ] Remplacement des données mockées par API
- [ ] Gestion des états de chargement
- [ ] Gestion des erreurs

### Frontend - Commandes
- [ ] Page Order connectée à l'API
- [ ] Formulaire d'adresse implémenté
- [ ] Confirmation de commande

### Frontend - Wishlist
- [ ] WishlistContext connecté à l'API
- [ ] Migration localStorage → SQL

### Tests et Documentation
- [ ] Tests de tous les endpoints
- [ ] Documentation API créée
- [ ] Optimisations effectuées

---

## 📚 Ressources et bonnes pratiques

### Sécurité
- Toujours hasher les mots de passe avec bcrypt
- Valider toutes les entrées utilisateur
- Utiliser des requêtes préparées pour éviter les injections SQL
- Limiter le taux de requêtes (rate limiting)
- Utiliser HTTPS en production

### Performance
- Utiliser des index SQL appropriés
- Implémenter la pagination pour les listes
- Mettre en cache les données fréquemment consultées
- Optimiser les requêtes N+1

### Code
- Séparer les responsabilités (controllers, services, models)
- Gérer les erreurs de manière cohérente
- Documenter le code
- Utiliser des variables d'environnement pour les configurations

---

## 🚀 Prochaines étapes recommandées

Une fois le backend de base implémenté, vous pourrez ajouter :

1. **Système d'avis clients** : Table `reviews` déjà prévue
2. **Codes promo** : Table `promo_codes` déjà prévue
3. **Notifications email** : Confirmation de commande, etc.
4. **Paiement en ligne** : Intégration Stripe ou PayPal
5. **Panel administrateur** : Gestion des produits, commandes, utilisateurs
6. **Statistiques** : Tableau de bord avec ventes, produits populaires, etc.

---

**Date de création** : 2024  
**Dernière mise à jour** : 2024  
**Auteur** : Documentation Harmony Project
