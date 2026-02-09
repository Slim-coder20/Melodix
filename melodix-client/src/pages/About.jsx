import Carrousel from "@/components/Carrousel";
import { Link } from "react-router-dom";
export default function About() {
  // Variable //
  const Cards = [
    {
      id: 1,
      title: "80 musiciens au service des musiciens.",
      content:
        "4 Melodix Stores situés au coeur de la cité de la musique de Paris, un centre d’appel gratuit, une plateforme logistique et un SAV internalisé, vous assurent une tranquilité sans concurrence.",
    },
    {
      id: 2,
      title: "Comparer pour quoi faire ?",
      content:
        "Convaincu de vous proposer les meilleurs prix, melodix.com vous rembourse la différence si vous trouvez moins cher ailleurs.",
    },
    {
      id: 3,
      title: "Financez à votre rythme !",
      content:
        "Avec melodix.com, votre rêve est à portée de main, nous vous proposons une large gamme de financement, notamment en 3 fois sans frais et jusqu'à 12 fois à partir de 50€.",
    },
 
  ];
  return (
    <div className=" min-h-screen">
      {/* Navigation menu about  */}
      <div className=" w-full bg-blue-800 px-3 py-4 md:p-8 text-white font-normal">
        <ul className=" flex flex-wrap md:flex-nowrap justify-center items-center gap-3 sm:gap-6 md:gap-10 ">
          <li>
            <Link
              to="/about"
              className="text-base sm:text-lg md:text-2xl hover:font-bold transition duration-300 text-center"
            >
              QUI SOMMES NOUS ?
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="text-base sm:text-lg md:text-2xl hover:font-bold transition duration-300 text-center"
            >
              CONTACT
            </Link>
          </li>
          <li>
            <Link
              to="/equipe"
              className="text-base sm:text-lg md:text-2xl hover:font-bold transition duration-300 text-center"
            >
              L'ÉQUIPE{" "}
            </Link>
          </li>
          <li>
            <Link
              to="/harmony-store"
              className="text-base sm:text-lg md:text-2xl hover:font-bold transition duration-300 text-center"
            >
              HARMONY STORE
            </Link>
          </li>
          <li>
            <Link
              to="/logistique"
              className="text-base sm:text-lg md:text-2xl hover:font-bold transition duration-300 text-center"
            >
              LOGISTIQUE
            </Link>
          </li>
        </ul>
      </div>
      {/* Contenu principale */}
      <div className=" container mx-auto px-4 mt-6">
        <h1 className=" text-3xl sm:text-4xl md:text-6xl text-blue-700 py-8 md:py-14 font-bold">
          QUI SE CACHE DERRIÈRE MELODIX MUSIC ?
        </h1>
        <h2 className=" text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-8">MELODIX MUSIC EN BREF ...</h2>
        <p className=" text-base sm:text-lg md:text-2xl ">
          Avec 90 000 instruments et accessoires de musique disponibles et 940
          marques proposées, Melodix Music attire en moyenne 1,4 million de
          visiteurs par mois. Nos 20 ans d’expertise, un site traduit en 7
          langues et 80 passionnés au service des musiciens font de Harmony         
          Music le n°1 français de la vente d’équipement musical et un acteur
          incontournable au niveau Européen.
        </p>
        <h2 className=" text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-8 mt-6 md:mt-10">
          melodix.com, une success story Made in France !
        </h2>
        <p className="text-base sm:text-lg md:text-2xl">
          Aujourd’hui Melodx Music, c’est plus de 90000 références proposées et
          plus de 940 marques. C’est 4 Melodix Stores sur une surface de 700m²
          au cœur de la Cité de la Musique à Paris ainsi qu’un site web
          Harmonymusic.com comptant 1,4 million de visiteurs chaque mois. “La
          Musique est à tout le Monde !” - telle est la philosophie de
          melodix.com. Rendre accessible la pratique instrumentale au plus
          grand nombre, grâce aux prix les plus bas du marché tout en conservant
          une qualité de service optimale. Et la recette paye : des musiciens de
          toutes tranches d’âges et venant du monde entier visitent chaque mois
          les Melodix Stores et le site Internet. Près de 200 000 fans suivent
          et “like” chaque jour les actualités de Woodbrass sur le réseau social
          Facebook. 80 employés, musiciens passionnés, travaillent aujourd’hui
          chez Woodbrass pour partager avec vous une passion commune, la musique
          !
        </p>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-8 mt-6 md:mt-10">
          Notre sixième sens, le service
        </h2>
        <span className=" text-lg sm:text-xl md:text-2xl font-bold ">Melodix.com s’engage !</span>
        <p className=" text-base sm:text-lg md:text-2xl">
          95% des commandes passées sur melodix.com sont livrées en 24h (France
          Métropolitaine). Pour toute commande passée avant midi, notre
          partenaire Chronopost s’engage à vous livrer dès le lendemain avant
          13h(du lundi au vendredi)
        </p>
        {/* Contenu des cartes  */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mt-10 md:mt-16 mb-10 md:mb-16">
          {Cards.map((card) => (
            <div
              key={card.id}
              className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            >
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                {card.title}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {card.content}
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 rounded text-sm md:text-base transition-colors duration-300 cursor-pointer">
                VOIR PLUS
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
