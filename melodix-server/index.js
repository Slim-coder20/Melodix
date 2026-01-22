import express from 'express'; 
import cors from 'cors'; 
import dotenv from 'dotenv'; 
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Charger le .env depuis le dossier melodix-server
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cahrger le dotenv avant d'importer les fichiers DB 
dotenv.config({ path: join(__dirname, '.env') });

//Importattion des modules de base de données 
import { connectMongo } from './DB/mongoDB.js';
import { connectPostgres } from './DB/postgres.js';


// Initialize Express app // 
const app = express(); 

// Middleware // 
app.use(cors()); 
app.use(express.json()); 

// Connect to MongoDB // 
await connectMongo();
await connectPostgres();
//Start the server // 
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});