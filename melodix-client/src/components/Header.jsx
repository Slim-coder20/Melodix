import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaUser,
  FaSearch,
  FaInfo,
  FaHeart,
} from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function Header() {
  const { totalCount } = useCart();
  const { totalCount: wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileQuery, setMobileQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef(null);
  
  // Pour afficher des notifications (toasts) lors d'ajout/suppression/vidage
  const { showToast } = useToast();
  
  // Récupérer les information du contexte d'authentification // 
  const { user, isAuthenticated, logout} = useAuth(); 

  // fonction pour gérer la déconnexion // 
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      showToast("Erreur lors de la déconnexion", { type: "error" });
    }
  }

  // Fonction pour gérer la soumission de la recherche mobile // 
  function handleMobileSearchSubmit(e) {
    e.preventDefault();
    const q = mobileQuery.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setMobileSearchOpen(false);
    setMobileQuery("");
  }

  // Fonction pour gérer la soumission de la recherche desktop
  function handleDesktopSearchSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get('search')?.trim();
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  }

  // Fermer le menu utilisateur en cliquant à l'extérieur
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);
  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50">
      {/* Logo */}
      <div className="max-w-7xl mx-auto px-4 py-2 md:py-3 grid grid-cols-3 md:grid-cols-[auto_1fr_auto] items-center gap-3">
        {/* Gauche: Logo */}
        <div className="flex flex-row items-center gap-4 flex-1">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex items-center gap-2">
              {/* Symbole musical moderne - ondes sonores */}
              <svg
                className="h-8 md:h-10 w-auto cursor-pointer transition-transform group-hover:scale-110"
                viewBox="0 0 60 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
                {/* Ondes sonores stylisées */}
                <path
                  d="M8 28 L8 20 Q8 16 12 16 Q16 16 16 20 L16 28 Q16 32 12 32 Q8 32 8 28 Z"
                  fill="url(#logoGradient)"
                />
                <path
                  d="M20 24 L20 20 Q20 14 26 14 Q32 14 32 20 L32 24 Q32 30 26 30 Q20 30 20 24 Z"
                  fill="url(#logoGradient)"
                  opacity="0.8"
                />
                <path
                  d="M36 22 L36 20 Q36 12 44 12 Q52 12 52 20 L52 22 Q52 30 44 30 Q36 30 36 22 Z"
                  fill="url(#logoGradient)"
                  opacity="0.6"
                />
              </svg>
              {/* Texte Harmony avec style moderne */}
              <span className=" text-2xl md:text-4xl font-bold text-white group-hover:text-blue-400 transition-colors cursor-pointer tracking-tight">
                Melodix
              </span>
            </div>
          </Link>
        </div>

        {/* Input de Recherche  */}
        <div className="flex-1 flex justify-center">
          {/* Mobile: icône loupe */}
          <button
            aria-label="Recherche"
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded bg-gray-800 hover:bg-gray-700"
            onClick={() => setMobileSearchOpen(true)}
          >
            <FaSearch />
          </button>
          {/* Desktop: formulaire de recherche */}
          <form 
            onSubmit={handleDesktopSearchSubmit}
            className="hidden md:block relative w-full max-w-xl"
          >
            <input
              type="text"
              name="search"
              placeholder="Rechercher..."
              className="bg-white w-full p-3 border rounded pr-10 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Rechercher"
            >
              <FaSearch size={18} />
            </button>
          </form>
        </div>
        {/* Le menu de connexion / pannier / a propos / favoris */}
        <div className="flex-1 flex justify-end gap-2 md:gap-6 ">
          {/* Compte / Menu utilisateur */}
          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              {/* Bouton avec initiales */}
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors border-2 border-gray-700 hover:border-blue-500"
                aria-label="Menu utilisateur"
                title={`${user?.firstName} ${user?.lastName}`}
              >
                <span className="text-xs font-semibold text-white">
                  {user?.firstName?.[0]?.toUpperCase()}
                  {user?.lastName?.[0]?.toUpperCase()}
                </span>
              </button>
              
              {/* Menu déroulant */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200 transition-all duration-200 opacity-100 transform translate-y-0">
                  {/* En-tête avec informations utilisateur */}
                  <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    {user?.role === 'admin' && (
                      <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                        Administrateur
                      </span>
                    )}
                  </div>
                  
                  {/* Options du menu */}
                  <div className="py-1">
                    {/* Option: Mon profil (à décommenter si vous créez une page profil) */}
                    {/* <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Mon profil
                    </Link> */}
                    
                    {/* Séparateur */}
                    <div className="border-t border-gray-200 my-1"></div>
                    
                    {/* Bouton déconnexion */}
                    <button
                      onClick={() => {
                        handleLogout();
                        setUserMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center justify-center w-10 h-10 rounded bg-gray-800 hover:bg-gray-700 transition-colors"
              aria-label="Se connecter"
            >
              <FaUser size={18} />
            </Link>
          )}

          {/* Favoris */}
          <Link
            to="/wishlist"
            className="relative inline-flex items-center justify-center w-10 h-10 rounded bg-gray-800 hover:bg-gray-700"
            aria-label="Favoris"
          >
            <FaHeart size={18} />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full min-w-[1.25rem] h-5 px-1.5 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Panier */}
          <Link
            to="/order"
            className="relative inline-flex items-center justify-center w-10 h-10 rounded bg-gray-800 hover:bg-gray-700"
            aria-label="Panier"
          >
            <FaShoppingCart size={18} />
            {totalCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full min-w-[1.25rem] h-5 px-1.5 flex items-center justify-center">
                {totalCount}
              </span>
            )}
          </Link>

          {/* À propos */}
          <Link
            to="/about"
            className="inline-flex items-center justify-center w-10 h-10 rounded bg-gray-800 hover:bg-gray-700"
            aria-label="À propos"
          >
            <FaInfo size={18} />
          </Link>
        </div>
      </div>

      {/* Overlay de recherche mobile */}
      {mobileSearchOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileSearchOpen(false)}>
          <div className="absolute top-20 left-0 right-0 px-3" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleMobileSearchSubmit} className="bg-white rounded shadow p-2 flex flex-wrap items-center gap-2">
              <FaSearch className="text-gray-500" />
              <input
                autoFocus
                type="search"
                value={mobileQuery}
                onChange={(e) => setMobileQuery(e.target.value)}
                placeholder="Rechercher..."
                className="w-full flex-1 min-w-0 h-10 px-2 outline-none text-black"
              />
              <div className="flex w-full justify-end gap-2">
                <button type="button" onClick={() => setMobileSearchOpen(false)} className="px-3 h-10 rounded bg-gray-200 text-gray-800 text-sm">Annuler</button>
                <button type="submit" className="px-3 h-10 rounded bg-blue-600 text-white font-semibold text-sm">Rechercher</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}

