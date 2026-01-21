import React, { useState } from "react";
import { FaSearch, FaTruck, FaPhone, FaBoxes, FaStore } from "react-icons/fa";

export default function FooterFixed() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselItems = [
    { id: 1, icon: FaSearch, title: "QUI SE CACHE DERRIÈRE HARMONY MUSIC", description: "80 musiciens à votre service !" },
    { id: 2, icon: FaTruck, title: "LIVRAISON GRATUITE", description: "dès 50€ d'achat en France Métropolitaine" },
    { id: 3, icon: FaPhone, title: "QUESTION / CONSEILS", description: "01 56 65 21 22" },
    { id: 4, icon: FaStore, title: "4 HARMONY MUSIC STORE", description: "Oubliez toutes vos références 700m2 d'espace musical" },
    { id: 5, icon: FaBoxes, title: "GARANTIE 3 ANS", description: "Une garantie de 3 ans pour tout article acheté" },
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev >= carouselItems.length - 3 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? carouselItems.length - 3 : prev - 1));

  return (
    <footer className="p-6 md:p-12 border-t bg-gray-900 text-white w-full">
      <div className="relative overflow-hidden">
        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded">
          ←
        </button>
        <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${currentSlide * 33.33}%)` }}>
          {carouselItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <div key={item.id} className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 text-center px-4">
                <IconComponent className="text-blue-400 text-3xl mx-auto mb-2" />
                <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                <p className="text-gray-300 text-xs">{item.description}</p>
              </div>
            );
          })}
        </div>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded">
          →
        </button>
      </div>
      <div className="flex flex-col items-center text-center gap-8 mt-10 md:mt-12 md:grid md:grid-cols-2 lg:grid-cols-4 md:text-left">
        {/* Espace Pro + Réseaux + Newsletter + Logo (déplacé à gauche) */}
        <div className="mt-6 md:mt-10 space-y-8 w-full md:w-auto">
          <div>
            <h4 className="font-bold mb-2">ESPACE PRO</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>Devenir partenaire</li>
              <li>Demande de devis</li>
            </ul>
          </div>
            {/* Social medias  */}
          <div>
            <h4 className="font-bold mb-2">SUIVEZ-NOUS</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li><a href="https://www.facebook.com">Facebook</a></li>
              <li><a href="https://www.instagram.com">Instagram</a></li>
              <li><a href="https://www.twitter.com">Twitter</a></li>
              <li><a href="https://www.youtube.com">YouTube</a></li>
              <li><a href="https://www.linkedin.com">LinkedIn</a></li>
            </ul>
          </div>
            {/* newsletter */}
          <div>
            <h4 className="font-bold mb-2">NEWSLETTER</h4>
            <p className="text-sm text-gray-300 mb-2">Inscrivez-vous à notre newsletter pour recevoir les dernières actualités et offres.</p>
            <form className="flex flex-col md:flex-row gap-2 md:gap-0 md:items-stretch items-center">
              <input type="email" placeholder="Votre email" className="w-full md:flex-1 p-2 border border-gray-300 rounded md:rounded-l md:rounded-r-none text-black" />
              <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white p-2 rounded md:rounded-r md:rounded-l-none cursor-pointer">S'inscrire</button>
            </form>
          </div>

          <div className="mt-4 text-center text-4xl font-bold">
            <span>Melodix</span>
          </div>
        </div>

        {/* Horaires */}
        <div className="mt-6 md:mt-10 w-full md:w-auto">
          <h4 className="font-bold mb-2">HORAIRES D'OUVERTURE</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>Lundi - Vendredi: 10h - 19h</li>
            <li>Samedi: 10h - 18h</li>
            <li>Dimanche: Fermé</li>
          </ul>
        </div>

        {/* Service client */}
        <div className="mt-6 md:mt-10 w-full md:w-auto">
          <h4 className="font-bold mb-2">SERVICE CLIENT</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li><a href="/livraison">Livraison</a></li>
            <li><a href="/retours">Retours</a></li>
            <li><a href="/contact">Contactez-nous</a></li>
          </ul>
        </div>

        {/* Informations (déplacé en 4ème colonne) */}
        <div className="mt-6 md:mt-10 w-full md:w-auto">
          <h4 className="font-bold mb-2">INFORMATIONS</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li><a href="/qui-sommes-nous">Qui sommes-nous ?</a></li>
            <li><a href="/nos-magasins">Nos magasins</a></li>
            <li><a href="/conditions-generales">Conditions générales de vente</a></li>
            <li><a href="/mentions-legales">Mentions légales</a></li>
            <li><a href="/politique-confidentialite">Politique de confidentialité</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
