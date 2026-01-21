import React from "react";
import { useCart } from "@/context/CartContext"
import { eur } from "@/lib/format";
import { allProducts } from "@/data";
import ProductCard from "@/components/ProductCard";


export default function Order() {
  const { items, updateQty, removeItem, clearCart, totalCount, totalPrice, subtotal, vat, shipping, discount, grandTotal } = useCart(); 
  const cartIds = new Set(items.map(p => p.id)); 
  const categories = new Set(items.map(p => p.category).filter(Boolean)); 

  const similar = allProducts
      .filter(p => categories.has(p.category) && !cartIds.has(p.id)).slice(0,4)
  if(!items.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Panier vide 
      </div>
    )
  }
  
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-4 md:py-6 pb-20 md:pb-0">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <button onClick={clearCart} className="text-sm text-red-600 hover:underline">
            Vider le panier
          </button>
        </div>

        {/* Grille: liste (2 colonnes) + récap (1 colonne) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Carte liste */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-3 md:p-4">
            <ul className="divide-y">
              {items.map((p) => (
                <li key={p.id} className="py-3 md:py-4 flex items-center gap-3 md:gap-4">
                  <img src={p.image} alt={`${p.brand} ${p.model}`} className="w-16 h-16 md:w-20 md:h-20 object-contain" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm md:text-base truncate">{p.brand}</p>
                    <p className="text-xs md:text-sm text-gray-600 truncate">{p.model}</p>
                    <div className="mt-2 flex items-center gap-2 md:gap-3">
                      <label htmlFor={`qty-${p.id}`} className="text-xs md:text-sm text-gray-600">Qté</label>
                      <input
                        id={`qty-${p.id}`}
                        type="number"
                        min={1}
                        value={p.qty}
                        onChange={(e) => updateQty(p.id, e.target.value)}
                        className="w-14 h-9 md:w-20 md:h-auto border rounded px-2 py-1 text-sm"
                      />
                      <button onClick={() => removeItem(p.id)} className="text-xs md:text-sm text-red-600 hover:underline">
                        Supprimer
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sm md:text-base whitespace-nowrap">{eur.format(p.price * p.qty)}</div>
                    <div className="hidden md:block text-xs text-gray-500">{eur.format(p.price)} / unité</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Carte récap */}
          <aside className="bg-white rounded-lg shadow p-3 md:p-4 h-fit lg:sticky lg:top-6">
            <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Récapitulatif</h2>
            <div className="space-y-2 text-xs md:text-sm">
              <div className="flex items-center justify-between">
                <span>Sous-total ({totalCount} article(s))</span>
                <span>{eur.format(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>TVA (20%)</span>
                <span>{eur.format(vat)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Livraison</span>
                <span>{shipping === 0 ? "Offerte" : eur.format(shipping)}</span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between text-green-700">
                  <span>Remise</span>
                  <span>-{eur.format(discount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm md:text-base font-semibold border-t pt-3">
                <span>Total</span>
                <span>{eur.format(grandTotal)}</span>
              </div>
            </div>
            <button className="hidden md:block mt-4 md:mt-6 w-full h-10 md:h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold md:font-bold rounded">
              Passer la commande
            </button>
          </aside>
        </div>

        {/* Articles similaires (placeholder) */}
        <section className="mt-6 md:mt-8">
          <h3 className="text-base md:text-lg font-semibold mb-3">Articles similaires</h3>
          {similar.length === 0 ? (
            <div className="text-sm text-gray-500">Aucune suggestion pour le moment.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {similar.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>
      </div>
      {/* Barre sticky mobile: total + CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-3 py-3 flex items-center gap-3">
          <div className="flex-1">
            <div className="text-xs text-gray-500 leading-tight">Total</div>
            <div className="text-lg font-semibold">{eur.format(grandTotal)}</div>
          </div>
          <button className="shrink-0 h-10 px-4 rounded bg-blue-600 text-white font-semibold">
            Passer la commande
          </button>
        </div>
      </div>
    </div>
  );
}

