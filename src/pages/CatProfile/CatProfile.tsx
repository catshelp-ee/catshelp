import React from "react";
import Header from "../Header.tsx";
import Sidebar from "../Dashboard/DesktopView/Sidebar.tsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Cat } from "../../types/Cat.ts";
import { Button } from "@mui/material";

const CatProfile: React.FC = () => {
  const navigate = useNavigate();
  const [cats, setCats] = useState<Cat[]>([]);
  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEditCat = () => {
    navigate("/edit-cat");
  };

  useEffect(() => {
    const fetchCats = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/animals/cat-profile");
        const fetchedCats = response.data.catProfiles || [];

        setCats(fetchedCats);

        if (fetchedCats.length > 0) {
          setSelectedCat(fetchedCats[0]);
        }
      } catch (error) {
        console.error("Error fetching cat data:", error);
        setCats([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  return (
    <div className="flex flex-col w-full h-screen">
      <Header />
      <div className="flex h-[calc(100vh-129px)]">
        <Sidebar />
        <main className="flex flex-col w-full mx-12 mb-4 flex-1">
          <section className="flex">
            <h1 className="text-xl md:text-4xl">Kiisude profiilid veebis</h1>
            <img loading="lazy" src="/welcome.svg" alt="" />
          </section>
          <p className="mt-4 text-secondary">
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
            ) : //TODO: loading animation
            loading ? (
              "Oota kuni kiisud kohale jõuavad"
            ) : (
              <p>Hetkel pole kasse.</p>
            )}
            {/* <div className="flex flex-col items-center space-y-4 text-center">
                <button
                  onClick={handleEditCat}
                  className="w-24 h-24 flex items-center justify-center bg-teal-500 text-white rounded-full shadow-md hover:bg-teal-600"
                >
                  <span className="text-4xl font-mono">+</span>
                </button>
                <div className="text-lg font-bold">Lisa uus kiisu</div>
              </div> */}
          </div>

          {selectedCat && (
            <div className="flex flex-col w-full border border-gray-300 p-4 rounded-md shadow max-md:mt-10 max-md:max-w-full">
              <div className="flex flex-row justify-between items-center">
                <div className="text-sm font-medium text-secondary text-bold">
                  PEALKIRI:
                </div>
                <Button sx={{ textTransform: "none" }} onClick={handleEditCat}>
                  <img src="/edit.png" alt="Edit" className="w-5 h-5 mr-2" />
                  Muuda/Lisa
                </Button>
              </div>
              <div className="text-l font-bold">
                {selectedCat.primaryInfo.heading}
              </div>
              <div className="text-sm font-medium text-secondary text-bold mt-3">
                LOOMA KIRJELDUS:
              </div>
              <p className="text-sm">{selectedCat.primaryInfo.description}</p>
              <div className="text-sm font-medium text-secondary text-bold mt-3">
                LOOMA PROFIIL:
              </div>
              <div className="text-sm font-bold">Kassi nimi</div>
              <div className="text-sm">{selectedCat.primaryInfo.name}</div>
              <div className="text-sm font-bold">Kassi ID</div>
              <div className="text-sm">{selectedCat.primaryInfo.rescueId}</div>
              <div className="text-sm font-bold">Kassi asukoht</div>
              <div className="text-sm">{selectedCat.primaryInfo.location}</div>
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
              <div className="text-sm">{selectedCat.primaryInfo.furLength}</div>
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
                  <div className="text-sm font-bold">Mis kassile meeldib:</div>
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
  );
};

export default CatProfile;
