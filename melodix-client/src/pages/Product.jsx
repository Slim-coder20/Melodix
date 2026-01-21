import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { guitareProducts } from "@/data/guitares";
import ProductDetail from "@/components/ProductDetail";
import { homeBestSellers, homeNewProducts, popularBrands } from "@/data/home";
import { bassProducts } from "@/data/basse";
import { effetsProducts } from "@/data/effets";
import { batterieProducts } from "@/data/batterie";
import { pianoClavierProducts } from "@/data/pianoClavier";
import { homeStudioProducts } from "@/data/homeStudio";
// Ce composant affiche la page détail d'un produit identifié par son `id` dans l'URL.
// Il récupère l'identifiant via le route param `productId`, recherche ce produit
// dans l'ensemble des sources de données (modules dans `src/data/`),
// puis passe l'objet trouvé au composant de présentation `ProductDetail`.
export default function Product() {
  const { productId } = useParams();
  const [item, setItem] = useState();

  // Effet: à chaque fois que l'`id` change (navigation vers un autre produit),
  // on recompose une liste globale en mémoire et on cherche l'article correspondant.
  useEffect(() => {
    // 1) Agrégation des sources de données.
    // L'intérêt: un mécanisme unique de résolution quel que soit l'univers (guitare, basse, batterie...)
    // ou la provenance (meilleures ventes, nouveautés, etc.).
    const allProducts = [
      ...guitareProducts,
      ...homeBestSellers,
      ...homeNewProducts,
      ...bassProducts,
      ...effetsProducts,
      ...batterieProducts,
      ...pianoClavierProducts,
      ...homeStudioProducts,
    ];

    // 2) Recherche de l'élément par identifiant stable (utilisé aussi comme clé React et slug d'URL).
    const found = allProducts.find((p) => p.id === productId);

    // 3) Mise à jour de l'état local: déclenche un nouveau rendu.
    setItem(found);
  }, [productId]);

  // Gestion d'erreur utilisateur simple: si l'id ne correspond à aucun produit
  // (mauvais lien, ancien favori, etc.), on affiche un message neutre.
  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Produit introuvable
      </div>
    );
  }

  // Une fois l'article résolu, on délègue l'affichage à `ProductDetail`.
  // Ce composant gère l'UI complète (images, prix, stock, onglets, CTA),
  // et les interactions (ajout panier/wishlist) via les Contexts.
  return (
    <ProductDetail
      item={item}
      homeBestSellers={homeBestSellers}
      homeNewProducts={homeNewProducts}
      popularBrands={popularBrands}
      guitareProducts={guitareProducts}
      bassProducts={bassProducts}
      effetsProducts={effetsProducts}
      batterieProducts={batterieProducts}
      pianoClavierProducts={pianoClavierProducts}
      homeStudioProducts={homeStudioProducts}
    />
  );
}
