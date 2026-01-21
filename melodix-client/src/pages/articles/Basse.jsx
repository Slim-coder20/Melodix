import { bassProducts } from "@/data/basse";
import ProductCard from "@/components/ProductCard";

export default function Basse() {
  const labelByCategory = {
    electrique: "Basses Électriques",
    fretless: "Basses Fretless",
    
  };

  const sections = ["electrique", "fretless"];

  return (
    <div className="min-h-screen p-8">
      {sections.map((cat) => {
        const items = bassProducts.filter((p) => p.category === cat);
        if (items.length === 0) return null;
        return (
          <div key={cat} className="mb-12">
            <h2 className="text-2xl mb-4">{labelByCategory[cat]}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {items.map((item) => (
                <ProductCard item={item} topVente={item.badge === "TOP VENTES"} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}