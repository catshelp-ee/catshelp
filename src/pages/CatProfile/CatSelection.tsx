import React from "react";
import { Cat, defaultCat } from "../../types/Cat.ts";

interface CatSelectionProps {
  cats: Cat[];
  selectedCat: Cat | null;
  setSelectedCat: (cat: Cat) => void;
  loading: boolean;
}

const CatSelection: React.FC<CatSelectionProps> = ({
  cats,
  selectedCat,
  setSelectedCat,
  loading,
}) => {
  return (
    <div>
      <section className="flex my-4 items-center">
        <h1 className="text-xl mx-4 md:text-4xl">Kiisude profiilid veebis</h1>
        <img loading="lazy" className="w-12 h-12" src="/welcome.svg" alt="" />
      </section>
      <p className="mt-4 mx-4 text-secondary">
        Siin näed ja saad muuta oma hoiulooma(de) kuulutus(i) catshelp.ee
        veebilehel Valimiseks klõpsa hoiulooma pildil
      </p>
      <div className="flex mx-4 flex-row flex-wrap gap-4 my-6">
        {cats.length > 0 ? (
          cats.map((cat, index) => (
            <div
              key={index}
              className="flex flex-col items-left text-center space-y-4 cursor-pointer"
              onClick={() => setSelectedCat(cat)}
            >
              {cat.images && cat.images[0] ? (
                <img
                  src={cat.images[0]}
                  alt={`${cat.name}'s profile`}
                  className="w-24 h-24 object-cover rounded-full shadow-md"
                />
              ) : (
                <div className="w-24 h-24 flex items-center justify-center bg-gray-200 text-gray-500 rounded-full shadow-m">
                  No Image Available
                </div>
              )}
              <div className="text-lg font-bold">{cat.name}</div>
              {selectedCat?.name === cat.name && (
                <div className="w-24 h-1 bg-teal-500 rounded-full mt-2"></div>
              )}
            </div>
          ))
        ) : //TODO: loading animation
        loading ? (
          "Oota kuni kiisud kohale jõuavad"
        ) : (
          <p>Hetkel pole kasse.</p>
        )}
      </div>
    </div>
  );
};

export default CatSelection;
