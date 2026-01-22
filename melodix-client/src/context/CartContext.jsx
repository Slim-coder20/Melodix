// src/context/CartContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";

// 1) Création du contexte (valeur par défaut: null)
const CartContext = createContext(null);

// 2) Clé de stockage pour localStorage
const STORAGE_KEY = "cart";

export default function CartProvider({ children }) {
  // 3) État du panier
  // On utilise un "lazy initializer" pour lire localStorage une seule fois au premier rendu.
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY); // chaîne JSON ou null
      return raw ? JSON.parse(raw) : []; // on parse, sinon tableau vide
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
      
      console.error("Erreur de persistance du panier:", error);
    }
  }, [items]);

  // 5) Action: ajouter un produit
  // - Si le produit existe déjà (même id), on incrémente qty
  // - Sinon on l’ajoute avec qty=1
  function addItem(product) {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx !== -1) {
        const copy = [...prev];
        const current = copy[idx];
        copy[idx] = { ...current, qty: (current.qty || 1) + 1 };
        return copy;
      }
      return [...prev, { ...product, qty: 1 }];
    });
  }

  // 6) Action: mettre à jour la quantité, en garantissant un minimum de 1
  function updateQty(id, qty) {
    const q = Math.max(1, Number(qty) || 1);
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty: q } : p)));
  }

  // 7) Action: supprimer un article par id
  function removeItem(id) {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }

  // 8) Action: vider complètement le panier
  function clearCart() {
    setItems([]);
  }

  // 9) Selecteur: nombre total d’articles (somme des qty)
  // useMemo évite de recalculer si items n’a pas changé.
  const totalCount = useMemo(
    () => items.reduce((acc, p) => acc + (p.qty || 1), 0),
    [items]
  );

  // 10) Selecteur: total TTC (somme prix * qty)
  const totalPrice = useMemo(
    () => items.reduce((acc, p) => acc + (Number(p.price) || 0) * (p.qty || 1), 0),
    [items]
  );

  // Calculs additionnels: sous-total, TVA, livraison, remise, total général
  const VAT_RATE = 0.2; // 20%
  const FREE_SHIPPING_THRESHOLD = 50; // livraison offerte dès 50€
  const SHIPPING_FLAT = 6.99;

  const subtotal = totalPrice;
  const vat = useMemo(() => subtotal * VAT_RATE, [subtotal]);
  const shipping = useMemo(
    () => (subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FLAT),
    [subtotal]
  );
  const discount = 0; // à brancher plus tard (codes promo)
  const grandTotal = useMemo(() => subtotal + vat + shipping - discount, [subtotal, vat, shipping]);

  // 11) Valeur exposée aux composants consommateurs
  const value = {
    items,
    addItem,
    updateQty,
    removeItem,
    clearCart,
    totalCount,
    totalPrice,
    subtotal,
    vat,
    shipping,
    discount,
    grandTotal,
  };

  // 12) On fournit la valeur via le Context Provider
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// 13) Hook de confort: récupère le contexte et protège contre un usage hors provider
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}