import express from 'express'; 
import cors from 'cors'; 
import dotenv from 'dotenv'; 
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Charger le .env depuis le dossier melodix-server
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger le dotenv avant d'importer les fichiers DB
dotenv.config({ path: join(__dirname, '.env') });

// Importation des modules de base de données
import { connectMongo } from './DB/mongoDB.js';
import { connectPostgres } from './DB/postgres.js';
import authRoutes from './routes/authRoute.js';


// Initialize Express app // 
const app = express(); 

// Middleware // 
app.use(cors()); 
app.use(express.json()); 

// Connect to MongoDB // 
await connectMongo();
await connectPostgres();

// Routes //
app.use('/api/auth', authRoutes);

// Start the server //
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});