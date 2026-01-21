import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useWishlist } from "@/context/WishlistContext";

export default function ProductDetail({ item }) {
  if (!item) return null;

  const hasBadge = item.badge && String(item.badge).trim().length > 0;
  const [tab, setTab] = useState("desc");
  const { addItem, items, totalCount, totalPrice} = useCart();   
  const { showToast } = useToast();
  const { toggle, hasItem } = useWishlist();
  const isFavorite = hasItem(item.id);

  

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-10">
        {/* En-tête: breadcrumb cliquable */}
        <div className="text-xs text-gray-500 mb-4">
          <Link to="/" className="hover:text-gray-700">Accueil</Link>
          <span className="mx-2">›</span>
          <Link to="/articles/guitare" className="hover:text-gray-700">Guitares</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-700">{item.brand} {item.model}</span>
        </div>

        {/* Zone principale */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Colonne image */}
          <div className="md:col-span-7">
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <div className="w-full aspect-[4/3] flex items-center justify-center overflow-hidden">
                <img
                  src={item.image}
                  alt={`${item.brand} ${item.model}`}
                  className="w-full h-full object-contain transition-transform duration-300 ease-out hover:scale-105"
                />
              </div>
            </div>
          </div>

          {/* Colonne infos/CTA */}
          <div className="md:col-span-5">
            <div className="bg-white rounded-lg shadow p-5 md:p-6 flex flex-col gap-4">
              {/* Badge top ventes */}
              {hasBadge && (
                <span className="self-start bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                  {item.badge}
                </span>
              )}

              {/* Titre produit */}
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold">{item.brand}</h1>
                <p className="text-gray-600">{item.model}</p>
              </div>

              {/* Prix */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold">{item.price}€</span>
                {item.monthly && (
                  <span className="text-sm">
                    ou <span className="text-blue-600 font-bold">{item.monthly}€ / mois</span>
                  </span>
                )}
              </div>

              {/* Stock / disponibilité */}
              {Array.isArray(item.stock) && item.stock.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.stock.map((s) => (
                    <span
                      key={s}
                      className="text-xs md:text-sm text-green-700 bg-green-50 px-2 py-1 rounded border border-green-100"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <button onClick={() => {
                  addItem(item);
                  showToast("Article ajouté au panier", { type: "success" });
                }} className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded">
                  Ajouter au panier
              </button>
              <button
  onClick={() => {
    toggle(item);
    showToast(
      isFavorite ? "Retiré des favoris" : "Ajouté aux favoris",
      { type: isFavorite ? "info" : "success" }
    );
  }}
  aria-pressed={isFavorite}
  aria-label={isFavorite ? "Retirer des favoris" : "Ajouter à la wishlist"}
  className={`flex-1 h-12 border ${
    isFavorite
      ? "border-red-300 text-red-600 hover:bg-red-50"
      : "border-gray-300 text-gray-700 hover:bg-gray-50"
  } font-semibold rounded transition-colors duration-200`}
>
  {isFavorite ? "Retirer des favoris" : "Ajouter à la wishlist"}
</button>
              </div>

              {/* Info livraison/retours */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-600 mt-2">
                <div className="bg-gray-50 rounded p-3">
                  <p className="font-semibold text-gray-700">Livraison</p>
                  <p>Dès 50€ d’achat</p>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <p className="font-semibold text-gray-700">Retours</p>
                  <p>30 jours</p>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <p className="font-semibold text-gray-700">Garantie</p>
                  <p>2 ans</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Onglets interactifs */}
        <div className="bg-white rounded-lg shadow p-5 md:p-6 mt-8">
          <div className="border-b mb-4">
            <nav className="flex gap-6 text-sm">
              <button
                onClick={() => setTab("desc")}
                className={`pb-3 font-semibold ${
                  tab === "desc" ? "border-b-2 border-blue-600 text-blue-700" : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setTab("specs")}
                className={`pb-3 font-semibold ${
                  tab === "specs" ? "border-b-2 border-blue-600 text-blue-700" : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Spécifications
              </button>
              <button
                onClick={() => setTab("reviews")}
                className={`pb-3 font-semibold ${
                  tab === "reviews" ? "border-b-2 border-blue-600 text-blue-700" : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Avis
              </button>
            </nav>
          </div>

          {tab === "desc" && (
            <div className="text-gray-700 text-sm leading-relaxed">
              <p>
                {item.brand} {item.model} est un excellent choix pour les musiciens à la recherche
                d’un instrument fiable et inspirant. Sonorités équilibrées, finitions soignées et
                confort de jeu au rendez-vous.
              </p>
            </div>
          )}

          {tab === "specs" && (
            <div className="text-gray-700 text-sm leading-relaxed">
              <ul className="list-disc pl-5 space-y-1">
                <li>Catégorie: {item.category}</li>
                <li>Prix: {item.price}€</li>
                {item.monthly && <li>Mensualité: {item.monthly}€ / mois</li>}
              </ul>
            </div>
          )}

          {tab === "reviews" && (
            <div className="text-gray-700 text-sm leading-relaxed">
              <p>Aucun avis pour le moment.</p>
            </div>
          )}
        </div>
      </div>

      {/* Barre CTA sticky mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur border-t">
        <button onClick={ () => {
          addItem(item);
          showToast("Article ajouté au panier", { type: "success" });
        }}  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded">
          Ajouter au panier
        </button>
        <button
  onClick={() => {
    toggle(item);
    showToast(
      isFavorite ? "Retiré des favoris" : "Ajouté aux favoris",
      { type: isFavorite ? "info" : "success" }
    );
  }}
  aria-pressed={isFavorite}
  aria-label={isFavorite ? "Retirer des favoris" : "Ajouter à la wishlist"}
  className={`w-full h-12 border ${
    isFavorite
      ? "border-red-300 text-red-600 hover:bg-red-50"
      : "border-gray-300 text-gray-700 hover:bg-gray-50"
  } font-semibold rounded mt-2 transition-colors duration-200`}
>
  {isFavorite ? "Retirer des favoris" : "Ajouter à la wishlist"}
</button>
      </div>
    </div>
  );
}