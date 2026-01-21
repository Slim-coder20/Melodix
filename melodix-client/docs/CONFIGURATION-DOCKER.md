# Configuration Docker - PostgreSQL + MongoDB

## 🐳 Docker Compose pour architecture hybride

### Fichier `docker-compose.yml` mis à jour

```yaml
services:
  # Application React (Frontend)
  harmony-app:
    build: .
    container_name: harmony-music-app
    ports:
      - "5173:5173"
    stdin_open: true
    tty: true
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - CHOKIDAR_USEPOLLING=true
    restart: unless-stopped
    depends_on:
      - postgres
      - mongodb

  # Serveur Express (Backend)
  server:
    image: nodejs
    build:
      context: .
      dockerfile: ./DockerfileNodeJs
    restart: always
    environment:
      POSTGRES_HOST: postgres
      POSTGRES_PORT: 5432
      POSTGRES_DB: harmony
      POSTGRES_USER: harmony_user
      POSTGRES_PASSWORD: harmony_password
      MONGODB_URI: mongodb://mongodb:27017/harmony
    ports:
      - 3000:3000
    command: node server.js
    depends_on:
      - postgres
      - mongodb

  # PostgreSQL (Catalogue, Stocks, Commandes)
  postgres:
    image: postgres:16-alpine
    container_name: harmony-postgres
    restart: always
    environment:
      POSTGRES_DB: harmony
      POSTGRES_USER: harmony_user
      POSTGRES_PASSWORD: harmony_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./sql_scripts:/docker-entrypoint-initdb.d
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U harmony_user -d harmony"]
      interval: 10s
      timeout: 5s
      retries: 5

  # MongoDB (Utilisateurs, Wishlist)
  mongodb:
    image: mongo:7
    container_name: harmony-mongodb
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: harmony_admin
      MONGO_INITDB_ROOT_PASSWORD: harmony_password
      MONGO_INITDB_DATABASE: harmony
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
      - ./mongo-init:/docker-entrypoint-initdb.d
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Adminer (Interface SQL - Optionnel)
  adminer:
    image: adminer
    restart: always
    ports:
      - 8080:8080
    environment:
      ADMINER_DEFAULT_SERVER: postgres
    depends_on:
      - postgres

  # MongoDB Express (Interface MongoDB - Optionnel)
  mongo-express:
    image: mongo-express
    restart: always
    ports:
      - 8081:8081
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: harmony_admin
      ME_CONFIG_MONGODB_ADMINPASSWORD: harmony_password
      ME_CONFIG_MONGODB_URL: mongodb://harmony_admin:harmony_password@mongodb:27017/
    depends_on:
      - mongodb

volumes:
  postgres_data:
  mongodb_data:
```

## 📝 Variables d'environnement

Créer un fichier `.env` à la racine :

```env
# PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=harmony
POSTGRES_USER=harmony_user
POSTGRES_PASSWORD=harmony_password
DATABASE_URL=postgresql://harmony_user:harmony_password@localhost:5432/harmony

# MongoDB
MONGODB_URI=mongodb://harmony_admin:harmony_password@localhost:27017/harmony?authSource=admin
MONGODB_DB=harmony

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# Server
PORT=3000
NODE_ENV=development
```

## 🚀 Commandes Docker

### Démarrer tous les services
```bash
docker compose up -d
```

### Voir les logs
```bash
docker compose logs -f
```

### Arrêter tous les services
```bash
docker compose down
```

### Arrêter et supprimer les volumes (⚠️ supprime les données)
```bash
docker compose down -v
```

### Redémarrer un service spécifique
```bash
docker compose restart postgres
docker compose restart mongodb
```

## 🔌 Connexions

### PostgreSQL
- **Host** : `localhost` (ou `postgres` depuis un container)
- **Port** : `5432`
- **Database** : `harmony`
- **User** : `harmony_user`
- **Password** : `harmony_password`
- **Interface Admin** : http://localhost:8080 (Adminer)

### MongoDB
- **Host** : `localhost` (ou `mongodb` depuis un container)
- **Port** : `27017`
- **Database** : `harmony`
- **User** : `harmony_admin`
- **Password** : `harmony_password`
- **Interface Admin** : http://localhost:8081 (Mongo Express)

## 📦 Installation des dépendances Node.js

### Pour PostgreSQL
```bash
npm install pg
# ou avec Prisma
npm install @prisma/client prisma
```

### Pour MongoDB
```bash
npm install mongoose
# ou client natif
npm install mongodb
```

## 🔧 Configuration initiale MongoDB

Créer un dossier `mongo-init/` avec un script d'initialisation :

```javascript
// mongo-init/init.js
db = db.getSiblingDB('harmony');

// Créer les collections
db.createCollection('users');
db.createCollection('wishlist');
db.createCollection('sessions');
db.createCollection('password_resets');

// Créer les index
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ resetPasswordToken: 1 });
db.users.createIndex({ emailVerificationToken: 1 });

db.wishlist.createIndex({ userId: 1, productId: 1 }, { unique: true });
db.wishlist.createIndex({ userId: 1 });
db.wishlist.createIndex({ productId: 1 });

db.sessions.createIndex({ token: 1 }, { unique: true });
db.sessions.createIndex({ userId: 1 });
db.sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

db.password_resets.createIndex({ token: 1 }, { unique: true });
db.password_resets.createIndex({ userId: 1 });
db.password_resets.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

print('MongoDB initialized successfully!');
```

## ✅ Vérification

### Vérifier que PostgreSQL fonctionne
```bash
docker exec -it harmony-postgres psql -U harmony_user -d harmony -c "SELECT version();"
```

### Vérifier que MongoDB fonctionne
```bash
docker exec -it harmony-mongodb mongosh -u harmony_admin -p harmony_password --authenticationDatabase admin --eval "db.version()"
```
