import React from "react";
import Header from "../Header.tsx";
import Sidebar from "../Dashboard/DesktopView/Sidebar.tsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Cat, defaultCat } from "../../types/Cat.ts";
import { Button } from "@mui/material";
import HamburgerMenu from "../Dashboard/DesktopView/HamburgerMenu.tsx";
import ImageGallery from "./ImageGallery.tsx";
import CatSelection from "./CatSelection.tsx";
import CatDetails from "./CatDetails.tsx";

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
      <div className="flex flex-col flex-grow md:flex-row">
        <Sidebar />
        <div className="block md:hidden w-full">
          <HamburgerMenu />
        </div>

        <main className="flex flex-col w-full md:mx-12 mb-4 flex-1">
          <CatSelection
            cats={cats}
            selectedCat={selectedCat}
            setSelectedCat={setSelectedCat}
            loading={loading}
          />

          {selectedCat && (
            <>
              <div className="flex mx-4 my-6 flex-row border border-gray-300 p-4 rounded-md shadow">
                <div className="flex flex-col flex-1">
                  <div className="flex flex-col md:flex-row  items-start">
                    <CatDetails
                      selectedCat={selectedCat}
                      handleEditCat={handleEditCat}
                    />
                    <div className="flex flex-col w-full md:w-auto md:flex-wrap my-4 items-center justify-center">
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
