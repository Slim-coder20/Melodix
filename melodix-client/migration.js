import fs from 'fs'; 

// 1. Importation des fichiers de données
import { bassProducts } from './src/data/basse.js';
import { batterieProducts } from './src/data/batterie.js';
import { effetsProducts } from './src/data/effets.js';
import { guitareProducts } from './src/data/guitares.js'; 
import { homeStudioProducts } from './src/data/homeStudio.js'; 
import { homeNewProducts, homeBestSellers  } from './src/data/home.js';
import { pianoClavierProducts } from './src/data/pianoClavier.js';


// 1. Ajout de l'URL supabase pour le rechargement des images depuis la base de données 
const SUPABASE_STORAGE_URL = "https://stzwjbfysnbrtcvafimk.supabase.co/storage/v1/object/public/products";

// 2. Fonction de logique pour les IDs de catégories (Gère les doublons comme "electrique")
const getCategoryId = (product, sourceFile) => {
  const cat = product.category;

  // Gestion spécifique du mot "electrique" qui est en double
  if (cat === "electrique") {
    if (sourceFile === 'basse') return 4;   // Basses Électriques
    if (sourceFile === 'guitare') return 1; // Guitares Électriques
  }

  // Mapping pour toutes les autres catégories uniques
  const mapping = {
    "fretless": 5,
    "effetbasse": 7,
    "effetguitare": 6,
    "batterie": 8,      // Pour tes batteries
    "electronique": 8,  // Batteries élec -> même ID
    "accoustique": 2,    // Par défaut pour guitares, géré après pour pianos
    "classique": 3,
    "pianoclavier": 9,
    "home-studio": 10,
    "sonorisation": 11,
    "amplis": 12, 
    "accessoires": 13,
  };

  // Correction spéciale pour les pianos qui utilisent aussi "accoustique" ou "acoustique"
  if ((cat === "accoustique" || cat === "acoustique") && sourceFile === 'piano') {
    return 9;
  }

  return mapping[cat] || 1; // Retourne 1 (Guitares Elec) par défaut si non trouvé
};

// 3. Fusion de tous les tableaux avec une "étiquette" de source
const allData = [
  ...bassProducts.map(p => ({ ...p, source: 'basse' })),
  ...guitareProducts.map(p => ({ ...p, source: 'guitare' })),
  ...batterieProducts.map(p => ({ ...p, source: 'batterie' })),
  ...effetsProducts.map(p => ({ ...p, source: 'effet' })),
  ...homeStudioProducts.map(p => ({ ...p, source: 'home' })),
  ...homeBestSellers.map(p => ({ ...p, source: 'home' })), 
  ...homeNewProducts.map(p => ({ ...p, source: 'home' })),
  ...pianoClavierProducts.map(p => ({ ...p, source: 'piano' }))
];

// 4. Fonction de génération du CSV
const generateCSV = (products) => {
  // En-tête correspondant à tes colonnes Supabase
  const header = "brand,model,slug,id_category,price,monthly,badge,image,is_active\n";
  
  const rows = products.map(p => {
    // On protège les textes avec des guillemets pour éviter les erreurs avec les virgules
    const brand = `"${p.brand}"`;
    const model = `"${p.model}"`;
    const slug = `"${p.id}"`; 
    const id_cat = getCategoryId(p, p.source);
    const price = p.price || 0;
    const monthly = p.monthly || 0;
    const badge = p.badge ? `"${p.badge}"` : "";
    const image = `"${p.image}"`; 

    // Ajout de l'URL de base devant le chemin 
    const imageUrl = `"${SUPABASE_STORAGE_URL}${p.image}`; 

    return `${brand},${model},${slug},${id_cat},${price},${monthly},${badge},${image},true`;
  }).join("\n");

  return header + rows;
};

// 5. Exécution et création du fichier
try {
  const csvContent = generateCSV(allData);
  fs.writeFileSync('./import_products.csv', csvContent);
  console.log("--------------------------------------------------");
  console.log("✅ SUCCÈS !");
  console.log(`📊 ${allData.length} produits ont été transformés.`);
  console.log("📄 Fichier généré : melodix-client/import_products.csv");
  console.log("--------------------------------------------------");
} catch (err) {
  console.error("❌ Erreur lors de la génération :", err);
}