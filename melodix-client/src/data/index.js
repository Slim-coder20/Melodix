import { guitareProducts } from "./guitares";
import { bassProducts } from "./basse";
import { homeStudioProducts } from "./homeStudio";
import { pianoClavierProducts } from "./pianoClavier";
import { effetsProducts } from "./effets";
import { batterieProducts } from "./batterie";
import { homeNewProducts } from "./home";

// On crée un tableau qui contiendra tous les produits dans un seul tableau // 

export const allProducts = [
    ...guitareProducts, 
    ...bassProducts, 
    ...pianoClavierProducts, 
    ...batterieProducts, 
    ...homeStudioProducts, 
    ...effetsProducts, 
    ...homeNewProducts, 
]; 