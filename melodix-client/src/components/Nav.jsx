import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Nav() {
  const [open, setOpen] = useState(false);

  // Auto-fermeture du menu 3s après ouverture
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => setOpen(false), 2000);
    return () => clearTimeout(timer);
  }, [open]);

  return (
    <nav className="bg-gray-900 text-white ">
      {/* Barre supérieure */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-center">
        {/* Titre / Label mobile (optionnel) */}
        <div className="font-semibold text-lg md:hidden">Catégories</div>

        {/* Bouton hamburger */}
        <button
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Liste desktop */}
        <ul className="hidden md:flex gap-6 items-center text-lg font-medium">
          <li><Link to="/guitare" className="hover:text-blue-400 transition">Guitares</Link></li>
          <li><Link to="/basse" className="hover:text-blue-400 transition">Basses</Link></li>
          <li><Link to="/batterie" className="hover:text-blue-400 transition">Batterie</Link></li>
          <li><Link to="/clavier-piano" className="hover:text-blue-400 transition">Clavier / Piano</Link></li>
          <li><Link to="/home-studio" className="hover:text-blue-400 transition">HomeStudio</Link></li>
        </ul>
      </div>
      {/* Menu mobile (toggle) */}
      {open && (
        <div className="md:hidden border-t border-white/10">
          <ul className="px-4 py-3 flex flex-col gap-3 text-base">
            <li><Link to="/guitare" onClick={() => setOpen(false)} className="block py-2 hover:text-blue-400">Guitares</Link></li>
            <li><Link to="/effet" onClick={() => setOpen(false)} className="block py-2 hover:text-blue-400">Effets</Link></li>
            <li><Link to="/basse" onClick={() => setOpen(false)} className="block py-2 hover:text-blue-400">Basses</Link></li>
            <li><Link to="/batterie" onClick={() => setOpen(false)} className="block py-2 hover:text-blue-400">Batterie</Link></li>
            <li><Link to="/clavier-piano" onClick={() => setOpen(false)} className="block py-2 hover:text-blue-400">Clavier / Piano</Link></li>
            <li><Link to="/home-studio" onClick={() => setOpen(false)} className="block py-2 hover:text-blue-400">HomeStudio</Link></li>
          </ul>
        </div>
      )}
    </nav>
  );
}