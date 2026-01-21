import { batterieProducts } from "@/data/batterie";
import ProductCard from "@/components/ProductCard";

export default function Batterie () {

    const labelByCategory = {
        electrique: "Batteries Électriques",
        acoustique: "Batteries Acoustiques",
        
      };

      const sections = ["electrique", "acoustique"];
      

      return (
        <div className="min-h-screen p-8">
          {sections.map((cat) => {
            const items = batterieProducts.filter((p) => p.category === cat);
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
      )
}


