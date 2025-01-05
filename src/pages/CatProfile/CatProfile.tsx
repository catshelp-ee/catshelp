import React from "react";
import Header from "../Header.tsx";
import Sidebar from "../Dashboard/Sidebar.tsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Cat } from "../../types/Cat.ts";

const mockCats: Cat = {
  primaryInfo: {
    name: "",
    image: "",
    rescueId: "",
    location: "Põhja-Pärnumaa",
    dateOfBirth: "",
    gender: "Emane",
    color: "Triibuline",
    furLength: "",
    additionalNotes: "",
    chipId: "",
    rescueDate: "",
    description: "",
  },
  moreInfo: {
    chronicIllnesses: "",
    timeInFosterCare: "",
    rescueHistory:
      "Audrust suvilarajoonist koos poegadega. Oli kohe väga sõbralik ja seltsiv ning soovis tähelepanu ja paisid.",
    personality: "Rahulik, sõbralik, seltsiv, rahumeelne",
    likes:
      "Pai saada, palju tähelepanu, magab öösiti voodis jalutsis. Kass kasutab liivakasti hästi, harjub kiirelt uue kohaga, kipub kratsima muud mööblit, usaldab inimesi kiiresti, eelistab kodutoitu kassikrõbinatele ja konservile. Tuleb jälgida ja hoolas olla",
    otherPersonalityTraits: "",
    dailyRoutine:
      "Jälgib ja kutsub poegi korrale. Soovib poegadest puhkust. On selline kuninglik ja vaoshoitud",
    interactions: {
      cats: "Neutraalselt",
      dogs: "Neutraalselt",
      children: "Hästi",
    },
    type: "Toa- ja õuekassiks",
    specialNeeds: "",
    otherInfo: "",
  },
};

const CatProfile: React.FC = () => {
  const navigate = useNavigate();
  const [cats, setCats] = useState<Cat[]>([]);
  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  const handleAddCat = () => {
    navigate("/lisa");
  };

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await axios.get("/api/animals/dashboard");
        const fetchedCats = response.data.pets || [];

        const mergedCats = fetchedCats.map((cat: any, index: number) => ({
          primaryInfo: {
            ...mockCats.primaryInfo,
            ...cat,
          },
          moreInfo: {
            ...mockCats.moreInfo,
          },
        }));

        console.log(mergedCats);
        setCats(mergedCats);

        if (mergedCats.length > 0) {
          setSelectedCat(mergedCats[0]);
        }
      } catch (error) {
        console.error("Error fetching cat data:", error);
        setCats([]);
      }
    };
    fetchCats();
  }, []);

  return (
    <div className="flex flex-col w-full h-full">
      <Header />
      <div className="mt-6 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          <Sidebar />
          <main className="flex-1 flex flex-col  max-w-3xl mx-auto max-md:ml-0 max-md:w-full text-left mb-3">
            <h1 className="text-xl font-bold">Kiisude profiil veebis</h1>
            <p className="mt-4">
              Siin näed ja saad muuta oma hoiulooma(de) kuulutus(i) catshelp.ee
              veebilehel Valimiseks klõpsa hoiulooma pildil
            </p>
            <div className="flex flex-row flex-wrap gap-4 my-6">
              {cats.length > 0 ? (
                cats.map((cat, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-left text-center space-y-4 cursor-pointer"
                    onClick={() => setSelectedCat(cat)}
                  >
                    {cat.primaryInfo.image ? (
                      <img
                        src={cat.primaryInfo.image}
                        alt={`${cat.primaryInfo.name}'s profile`}
                        className="w-24 h-24 object-cover rounded-full shadow-md"
                      />
                    ) : (
                      <div className="w-24 h-24 flex items-center justify-center bg-gray-200 text-gray-500 rounded-full shadow-m">
                        No Image Available
                      </div>
                    )}
                    <div className="text-lg font-bold">
                      {cat.primaryInfo.name}
                    </div>
                    {selectedCat?.primaryInfo.name === cat.primaryInfo.name && (
                      <div className="w-24 h-1 bg-teal-500 rounded-full mt-2"></div>
                    )}
                  </div>
                ))
              ) : (
                <p>No cats available at the moment.</p>
              )}
              <div className="flex flex-col items-center space-y-4 text-center">
                <button
                  onClick={handleAddCat}
                  className="w-24 h-24 flex items-center justify-center bg-teal-500 text-white rounded-full shadow-md hover:bg-teal-600"
                >
                  <span className="text-4xl">+</span>
                </button>
                <div className="text-lg font-bold">Lisa uus kiisu</div>
              </div>
            </div>

            {selectedCat && (
              <div className="flex flex-col w-full border border-gray-300 p-4 rounded-md shadow max-md:mt-10 max-md:max-w-full">
                <div className="text-sm font-medium text-gray-500 text-bold">
                  PEALKIRI:
                </div>
                <div className="text-l font-bold">
                  Triibuline Kuninganna Kusja otsib oma inimest!
                </div>
                <div className="text-sm font-medium text-gray-500 text-bold mt-3">
                  LOOMA KIRJELDUS:
                </div>
                <p className="text-sm">{selectedCat.primaryInfo.description}</p>
                <div className="text-sm font-medium text-gray-500 text-bold mt-3">
                  LOOMA PROFIIL:
                </div>
                <div className="text-sm font-bold">Kassi nimi</div>
                <div className="text-sm">{selectedCat.primaryInfo.name}</div>
                <div className="text-sm font-bold">Kassi ID</div>
                <div className="text-sm">
                  {selectedCat.primaryInfo.rescueId}
                </div>
                <div className="text-sm font-bold">Kassi asukoht</div>
                <div className="text-sm">
                  {selectedCat.primaryInfo.location}
                </div>
                <div className="text-sm font-bold">Kassi vanus/sünnikp</div>
                <div className="text-sm">
                  {selectedCat.primaryInfo.dateOfBirth}
                </div>
                <div className="text-sm font-bold">Kassi sugu</div>
                <div className="text-sm">{selectedCat.primaryInfo.gender}</div>
                {/* <div className="text-sm font-bold">Kassi vanus</div>
                <div className="text-sm">{selectedCat.primaryInfo.age}</div> */}
                <div className="text-sm font-bold">Kassi värv</div>
                <div className="text-sm">{selectedCat.primaryInfo.color}</div>
                <div className="text-sm font-bold">Kassi karva pikkus</div>
                <div className="text-sm">
                  {selectedCat.primaryInfo.furLength}
                </div>
                <div className="text-sm font-bold">Kassi päästmiskp</div>
                <div className="text-sm">
                  {selectedCat.primaryInfo.rescueDate}
                </div>
                <div className="text-sm font-bold">Kassi kiibi ID</div>
                <div className="text-sm">{selectedCat.primaryInfo.chipId}</div>
                <div className="text-sm font-bold">Lisamärkmed kassi kohta</div>
                <div className="text-sm">
                  {selectedCat.primaryInfo.additionalNotes}
                </div>

                <button
                  className="mt-4 bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
                  onClick={() => setShowMoreInfo(!showMoreInfo)}
                >
                  {showMoreInfo ? "Peida Rohkem Info" : "Näita Rohkem Info"}
                </button>
                {/* <div className="text-sm font-bold">
                  Mis protseduurid hoiulisel tehtud on?
                </div>
                <div className="text-sm">{selectedCat.procedures}</div> */}
                {showMoreInfo && (
                  <div className="mt-4">
                    <div className="text-sm font-bold">
                      Kui kassil esineb krooniline haigus, vajab eritoitu või on
                      vigastus siis palun kirjuta sellest siia
                    </div>
                    <div className="text-sm">
                      {selectedCat.moreInfo?.chronicIllnesses}
                    </div>
                    <div className="text-sm font-bold">
                      Kui kaua on kass hoiukodus/kassitoas viibinud?
                    </div>
                    <div className="text-sm">
                      {selectedCat.moreInfo?.timeInFosterCare}
                    </div>
                    <div className="text-sm font-bold">
                      Kas sa tead kuidas kiisu meie MTÜ hoole alla sattus?
                      (Kirjeldada tema leidmise ajalugu, mis seisundis oli jne).
                    </div>
                    <div className="text-sm">
                      {selectedCat.moreInfo?.rescueHistory}
                    </div>
                    <div className="text-sm font-bold">Iseloom</div>
                    <div className="text-sm">
                      {selectedCat.moreInfo?.personality}
                    </div>
                    <div className="text-sm font-bold">
                      Mis kassile meeldib:
                    </div>
                    <div className="text-sm">{selectedCat.moreInfo?.likes}</div>
                    <div className="text-sm font-bold">
                      Kirjelda kassi mõne iseloomustava lausega (nt milline on
                      kiisu argipäev)
                    </div>
                    <div className="text-sm">
                      {selectedCat.moreInfo?.dailyRoutine}
                    </div>
                    <div className="text-sm font-bold">
                      Kuidas suhtub teistesse kassidesse?
                    </div>
                    <div className="text-sm">
                      {selectedCat.moreInfo?.interactions?.cats}
                    </div>
                    <div className="text-sm font-bold">
                      Kuidas suhtub koertesse?
                    </div>
                    <div className="text-sm">
                      {selectedCat.moreInfo?.interactions?.dogs}
                    </div>
                    <div className="text-sm font-bold">
                      Kuidas suhtub lastesse?
                    </div>
                    <div className="text-sm">
                      {selectedCat.moreInfo?.interactions?.children}
                    </div>
                    <div className="text-sm font-bold">
                      Kas ta sobiks toa- või õuekassiks?
                    </div>
                    <div className="text-sm">{selectedCat.moreInfo?.type}</div>
                    <div className="text-sm font-bold">
                      Kas kassil on mingeid erivajadusi?
                    </div>
                    <div className="text-sm">
                      {selectedCat.moreInfo?.specialNeeds}
                    </div>
                    <div className="text-sm font-bold">
                      Mingeid muid märkmeid või infot ?
                    </div>
                    <div className="text-sm">
                      {selectedCat.moreInfo?.otherInfo}
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CatProfile;
