import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";

const ProductCard = (props) => {
    const { item, topVente } = props;
    const { toggle, hasItem } = useWishlist();
    const { showToast } = useToast();
    const isFavorite = hasItem(item.id);

    function handleWishlistClick(e) {
        e.preventDefault();
        e.stopPropagation();
        // On s'appuie sur toggle côté contexte (ajoute si absent, retire si présent)
        toggle(item);
        showToast(
            isFavorite ? "Retiré des favoris" : "Ajouté aux favoris",
            { type: isFavorite ? "info" : "success" }
        );
    }
    return (
        <Link to={`/product/${item.id}`}>
            <div key={item.id} className="rounded-lg p-3 md:p-4 shadow-lg bg-white relative">
                {topVente &&
                    <span className=" absolute top-2 left-2 bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px] md:text-xs font-bold">
                        TOP VENTES
                    </span>
                }
                <img
                    src={item.image}
                    alt={`${item.brand} ${item.model}`}
                    className="w-full h-32 sm:h-36 md:h-48 object-contain mb-3 md:mb-4"
                />
                <h3 className="text-base md:text-lg font-semibold">{item.brand}</h3>
                <p className="text-gray-700 text-xs md:text-sm mb-2">{item.model}</p>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-xl md:text-2xl font-bold">{item.price}€</span>
                        <span className="text-xs md:text-sm">
                            ou <span className="text-blue-600 font-bold">{item.monthly}€ / mois</span>
                        </span>
                    </div>
                    {/* Bouton wishlist */}
                    <button
                        onClick={handleWishlistClick}
                        aria-pressed={isFavorite}
                        aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                        title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                        className="p-1.5 sm:p-2 rounded-full bg-white hover:bg-gray-50 shadow text-red-600 cursor-pointer"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="w-4 h-4 sm:w-5 sm:h-5"
                            fill={isFavorite ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733C11.285 4.876 9.623 3.75 7.688 3.75 5.099 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                            />
                        </svg>
                    </button>
                </div>
                <button className="w-full h-8 md:h-10 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold md:font-bold text-xs md:text-base cursor-pointer">
                    Ajouter au panier
                </button>

            </div>
        </Link>


    )
}
export default ProductCard;