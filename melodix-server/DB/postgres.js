import { Pool } from 'pg'; 

// Variable pour stocker le pool (créé après chargement de dotenv)
let pool = null;

// Fonction pour créer le pool de connexions
const createPool = () => {
  if (pool) return pool; // Pool déjà créé
  
  // Utiliser la connection string complète si disponible//
  const connectionConfig = process.env.DATABASE_URL 
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false // Requis pour Supabase
        }
      }
      // sinon utiliser les paramètres séparés
    : {
        host: process.env.POSTGRES_HOST,
        port: parseInt(process.env.POSTGRES_PORT, 10),
        database: process.env.POSTGRES_DB,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        ssl: {
          rejectUnauthorized: false // Requis pour Supabase
        }
      };
  
  pool = new Pool(connectionConfig);
  return pool;
};

// Exporter le pool qui sera utiliser a la première connexion 
// Utilisation  getPool() dans les routes après avoir appelé connectPostgres()
export const getPool = () => createPool();

// Fonction pour tester et établir la connexion
export const connectPostgres = async () => {
  try {
    // Vérifier que les variables sont définies
    if (!process.env.DATABASE_URL && !process.env.POSTGRES_HOST) {
      console.error(' DATABASE_URL or POSTGRES_HOST must be defined in .env');
      process.exit(1);
    }
    
    // Créer le pool maintenant que dotenv est chargé
    const dbPool = createPool();
    
    // Tester la connexion avec une requête simple
    await dbPool.query('SELECT NOW()');
    console.log(' Connected to PostgreSQL');
  } catch (error) {
    console.error('Error connecting to PostgreSQL:', error.message);
    process.exit(1);
  }
}