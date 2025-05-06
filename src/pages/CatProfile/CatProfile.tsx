import React from "react";
import Header from "../Header.tsx";
import Sidebar from "../Dashboard/DesktopView/Sidebar.tsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Cat, defaultCat } from "../../types/Cat.ts";
import CatInfoField from "./CatInfo.tsx";
import { Button } from "@mui/material";
import HamburgerMenu from "../Dashboard/DesktopView/HamburgerMenu.tsx";
import ImageGallery from "./ImageGallery.tsx";

const CatProfile: React.FC = () => {
  const navigate = useNavigate();
  const [cats, setCats] = useState<Cat[]>([]);
  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);
  const [loading, setLoading] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const handleGalleryOpen = () => {
    setIsGalleryOpen(true);
  };

  const handleEditCat = () => {
    navigate("/edit-cat");
  };

  useEffect(() => {
    const fetchCats = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/animals/cat-profile");
        const fetchedCats = response.data.catProfiles || [];

        // setCats(fetchedCats[0]);
        // if (fetchedCats[0].length > 0) {
        //   setSelectedCat(fetchedCats[0]);
        // }

        setCats([defaultCat]);
        setSelectedCat(defaultCat);
      } catch (error) {
        console.error("Error fetching cat data:", error);
        setCats([defaultCat]);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  return (
    <div className="flex flex-col w-full h-screen">
      <Header />
      <div className="flex flex-col h-[calc(100vh-129px)] md:flex-row">
        <Sidebar />
        <div className="block md:hidden w-full">
          <HamburgerMenu />
        </div>

        <main className="flex flex-col w-full md:mx-12 mb-4 flex-1">
          <section className="flex my-4 items-center">
            <h1 className="text-xl mx-4 md:text-4xl">
              Kiisude profiilid veebis
            </h1>
            <img
              loading="lazy"
              className="w-12 h-12"
              src="/welcome.svg"
              alt=""
            />
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

          {selectedCat && (
            <>
              <div className="flex mx-4 my-6 flex-row border border-gray-300 p-4 rounded-md shadow">
                <div className="flex flex-col flex-1">
                  <div className="flex flex-col md:flex-row  items-start">
                    <div className="flex flex-col flex-1 mr-3 my-4">
                      <div className="text-sm font-medium text-secondary text-bold">
                        PEALKIRI:
                      </div>
                      <div className="flex flex-row items-center justify-between">
                        <div className="md:text-xl font-bold">
                          {selectedCat.title}
                        </div>
                        <Button
                          sx={{ textTransform: "none" }}
                          onClick={handleEditCat}
                        >
                          <img
                            src="/edit.png"
                            alt="Edit"
                            className="w-5 h-5 mr-2"
                          />
                          Muuda/Lisa
                        </Button>
                      </div>
                      <div className="text-sm font-medium text-secondary text-bold mt-8 mb-2">
                        LOOMA KIRJELDUS:
                      </div>
                      <p className="md:text-sm leading-6 tracking-normal font-normal">
                        {selectedCat.description}
                      </p>
                      <div className="">
                        <div className="text-sm font-medium text-secondary text-bold mt-8 mb-2">
                          LOOMA PROFIIL:
                        </div>
                        <CatInfoField
                          label="Kassi nimi"
                          value={selectedCat.name}
                        />
                        <CatInfoField
                          label="Kassi vanus/sünnikp"
                          value={selectedCat.age}
                        />
                        <CatInfoField
                          label="Kassi välimus"
                          value={selectedCat.appearance}
                        />
                        <CatInfoField
                          label="Protseduurid"
                          value={selectedCat.procedures}
                        />
                        <CatInfoField
                          label="Kassi päästmiskp"
                          value={selectedCat.rescueDate}
                        />
                        <CatInfoField
                          label="Ajalugu"
                          value={selectedCat.history}
                        />
                        <CatInfoField
                          label="Iseloom"
                          value={selectedCat.characteristics}
                        />
                        <CatInfoField
                          label="Meeldib"
                          value={selectedCat.likes}
                        />
                        <CatInfoField
                          label="Suhtub kassidesse"
                          value={selectedCat.treatOtherCats}
                        />
                        <CatInfoField
                          label="Suhtub koertesse"
                          value={selectedCat.treatDogs}
                        />
                        <CatInfoField
                          label="Suhtub lastesse"
                          value={selectedCat.treatChildren}
                        />
                        <CatInfoField
                          label="Toa/õuekass"
                          value={selectedCat.outdoorsIndoors}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col w-full md:w-auto md:flex-wrap items-center justify-center">
                      {selectedCat.images && selectedCat.images[0] && (
                        <div className="w-full md:w-auto flex justify-center">
                          <img
                            src={`${selectedCat.images[0]}`}
                            alt={`${selectedCat.images[0]}`}
                            className="w-24 h-24 min-w-52 min-h-52 object-cover rounded-lg mb-3"
                          />
                        </div>
                      )}

                      {selectedCat.images && selectedCat.images.length > 1 && (
                        <>
                          <div className="hidden md:block relative">
                            <img
                              src={`${selectedCat.images[0]}`}
                              alt={`${selectedCat.images[0]}`}
                              className="w-24 h-24 min-w-52 min-h-52 object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-white bg-opacity-60"></div>
                            <div
                              className="absolute inset-0 flex items-center justify-center font-semibold text-xl cursor-pointer"
                              onClick={handleGalleryOpen}
                              role="button"
                            >
                              + {selectedCat.images.length - 1} pilti
                            </div>
                          </div>
                          <div className="block md:hidden cursor-pointer">
                            <Button
                              sx={{
                                width: "100%",
                                height: "100%",
                                backgroundColor: "#007AFF",
                                fontSize: "13px",
                                padding: "4px 12px",
                                borderRadius: "6px",
                                textTransform: "none",
                              }}
                              onClick={handleGalleryOpen}
                              variant="contained"
                            >
                              Vaata veel
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <ImageGallery
                images={selectedCat.images || []}
                open={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default CatProfile;
