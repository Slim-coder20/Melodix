import HorizontalMenu from "@/components/HorizontalMenu";

export default function MelodixStore() {
  const stores = [
    {
      title: "GUITARES & BASSES",
      image: "/home/boutique1.jpeg",
    },
    {
      title: "BATTERIES & PERCUSSIONS",
      image: "/home/boutique2.webp",
    },
    {
      title: "CLAVERS & HOME STUDIO",
      image: "/home/boutique3.avif",
    },
  ];
  return (
    <div className="min-h-screen">
      {/* Menu de navigation */}
      <HorizontalMenu />
      <div className=" bg-gray-100 px-4 py-8 md:p-20 relative">
        <h1 className=" text-3xl sm:text-5xl md:text-8xl text-center font-bold leading-tight">
          LES MAGASINS MELODIX MUSIC À PARIS
        </h1>
      </div>
      {/* Section des images  */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-10 px-4 md:p-8">
        {stores.map((store, index) => (
          <div
            key={index}
            className=" relative group overflow-hidden rounded-lg shadow-lg transform transition duration-300 hover:scale-105"
          >
            <img
              src={store.image}
              alt={store.title}
              className="w-full h-48 sm:h-56 md:h-72 object-cover"
            />
            <div className=" absolute inset-0 flex flex-col justify-end p-3">
              <h2 className=" text-white text-lg sm:text-xl md:text-3xl font-bold drop-shadow">
                {store.title}
              </h2>
            </div>
          </div>
        ))}
      </div>
      {/* Section Horraires et accès  */}
      <div className="px-4 md:px-8 py-8 md:py-14">
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10 text-base md:text-lg font-medium">
          <div className="text-center">
            <p className="font-bold text-2xl md:text-3xl">LUNDI - VENDREDI</p>
            <p>9h00 - 18h00</p>
          </div>
          {/* Trait vertical */}
          <div className="hidden md:block border-l border-blue-800 h-12 md:h-20"></div>
          <div className="text-center">
            <p className="font-bold text-2xl md:text-3xl">SAMEDI</p>
            <p>10h00 - 18h00</p>
          </div>
        </div>
      </div>
    </div>
  );
}
