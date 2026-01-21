import React from "react";
import { Link } from "react-router-dom";
// Récupère l'état et les actions de la wishlist (items, toggle, clear, totalCount)
import { useWishlist } from "@/context/WishlistContext";
// Pour afficher des notifications (toasts) lors d'ajout/suppression/vidage
import { useToast } from "@/context/ToastContext";
// Accès au panier pour ajouter un article depuis la page favoris
import { useCart } from "@/context/CartContext";

export default function Wishlist() {
  // items: liste des favoris persistés dans localStorage
  // toggle: ajoute si absent, retire si présent
  // clearWishlist: vide toute la liste
  // totalCount: nombre d'éléments en favoris
  const { items, toggle, clearWishlist, totalCount } = useWishlist();
  // showToast: affiche un message temporaire en bas de l'écran
  const { showToast } = useToast();
  // addItem: ajoute un produit au panier
  const { addItem } = useCart();

  // Retire un produit de la wishlist via toggle et affiche un toast
  const handleRemove = (product) => {
    toggle(product);
    showToast("Retiré des favoris", { type: "info" });
  };

  // Vide toute la wishlist et affiche un toast
  const handleClear = () => {
    clearWishlist();
    showToast("Wishlist vidée", { type: "info" });
  };

  // Ajoute un produit au panier et affiche un toast de confirmation
  const handleAddToCart = (product) => {
    addItem(product);
    showToast("Article ajouté au panier", { type: "success" });
  };

  return (
    // Conteneur principal page avec fond gris clair
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-10">
        {/* En-tête de page: titre + bouton de vidage si la liste n'est pas vide */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold">Mes favoris</h1>
          {totalCount > 0 && (
            <button
              onClick={handleClear}
              className="text-sm px-3 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Vider la wishlist
            </button>
          )}
        </div>

        {/* État vide: invite à découvrir les produits si aucun favori */}
        {totalCount === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">Vous n'avez pas encore de favoris.</p>
            <Link
              to="/"
              className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Découvrir les produits
            </Link>
          </div>
        ) : (
          // État liste: grille responsive de cartes favoris
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((p) => (
              <div key={p.id} className="rounded-lg p-4 shadow bg-white flex flex-col">
                {/* Lien vers la fiche produit */}
                <Link to={`/product/${p.id}`} className="group">
                  <img
                    src={p.image}
                    alt={`${p.brand} ${p.model}`}
                    className="w-full h-44 object-contain mb-3 group-hover:opacity-90 transition"
                  />
                  <h3 className="text-lg font-semibold">{p.brand}</h3>
                  <p className="text-gray-700 text-sm mb-2">{p.model}</p>
                </Link>
                {/* Pied de carte: prix + actions Retirer / Ajouter au panier / Voir */}
                <div className="mt-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="text-lg sm:text-xl font-bold">{p.price}€</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleRemove(p)}
                      className="px-2 py-1 sm:px-3 sm:py-2 text-red-600 border border-red-200 rounded hover:bg-red-50 text-xs sm:text-sm"
                    >
                      Retirer
                    </button>
                    <button
                      onClick={() => handleAddToCart(p)}
                      className="px-2 py-1 sm:px-3 sm:py-2 bg-green-600 hover:bg-green-700 text-white rounded text-xs sm:text-sm"
                    >
                      Ajouter au panier
                    </button>
                    <Link
                      to={`/product/${p.id}`}
                      className="px-2 py-1 sm:px-3 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs sm:text-sm text-center"
                    >
                      Voir
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
