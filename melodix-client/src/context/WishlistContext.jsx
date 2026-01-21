import { createContext, useContext, useEffect, useMemo, useState } from "react";

// 1) Création du contexte (valeur par défaut: null)
const WishlistContext = createContext(null);

// 2) Clé de stockage pour localStorage
const STORAGE_KEY = "wishlist";

export default function WishlistProvider({ children }) {
  // 3) État du panier
  // On utilise un "lazy initializer" pour lire localStorage une seule fois au premier rendu.
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY); // chaîne JSON ou null
      return raw ? JSON.parse(raw) : [];             // on parse, sinon tableau vide
    } catch {
      // Si JSON.parse échoue ou localStorage indisponible, on part sur []
      return [];
    }
  });
 
  // 4) Persistance: à chaque changement de items, on sauvegarde en JSON.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Erreur de persistance de la wishlist:", error);
    }
  }, [items]);
 
  // 5) Action: ajouter un produit si absent (pas de quantité pour wishlist)
  function addItem(product) {
    setItems((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) return prev;
      return [...prev, product];
    });
  }
 
  // 6) Action: supprimer un article par id
  function removeItem(id) {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }
 
  // 7) Action: vider la wishlist
  function clearWishlist() {
    setItems([]);
  }
 
  // 8) Sélecteurs pratiques
  const totalCount = useMemo(() => items.length, [items]);
  const hasItem = (id) => items.some((p) => p.id === id);
 
  // 8bis) Action pratique: toggle (ajoute si absent, retire si présent)
  function toggle(product) {
    setItems((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      // On stocke un sous-ensemble minimal utile pour l'affichage
      const minimal = {
        id: product.id,
        brand: product.brand,
        model: product.model,
        price: product.price,
        image: product.image,
      };
      return [...prev, minimal];
    });
  }
 
  // 9) Valeur exposée aux composants consommateurs
  const value = {
    items,
    addItem,
    removeItem,
    clearWishlist,
    toggle,
    hasItem,
    totalCount,
  };
 
  // 10) Fournir via le Provider
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

// 11) Hook de confort: récupère le contexte et protège contre un usage hors provider
export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}