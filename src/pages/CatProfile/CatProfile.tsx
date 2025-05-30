import React, { useEffect, useState } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { useAlert } from "@context/AlertContext";
import { useAuth } from "@context/AuthContext.tsx";
import CatSelection from "./CatSelection.tsx";
import CatDetails from "./CatDetails.tsx";
import EditProfile from "./EditProfile.tsx";
import { Cat, defaultCat } from "@models/Cat.ts";

const CatProfileHeader = () => (
  <div>
    <section className="flex my-4 items-center">
      <h1 className="text-xl md:text-4xl">Kiisude profiilid veebis</h1>
      <img
        loading="lazy"
        className="w-12 h-12"
        src="/welcome.svg"
        alt="Welcome"
      />
    </section>
    <p className="mt-4 text-secondary">
      Siin näed ja saad muuta oma hoiulooma(de) kuulutus(i) catshelp.ee
      veebilehel Valimiseks klõpsa hoiulooma pildil
    </p>
  </div>
);

const CatProfile: React.FC = () => {
  const { getUser } = useAuth();
  const { showAlert } = useAlert();
  const [cats, setCats] = useState<Cat[]>([]);
  const [selectedCat, setSelectedCat] = useState<Cat>(defaultCat);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        setIsLoading(true);
        const user = await getUser();

        const response = await axios.get("/api/animals/cat-profile", {
          params: {
            owner: {
              name: user.fullName,
              email: user.email,
            },
          },
        });

        const fetchedCats = response.data.profiles;
        setCats(fetchedCats);
        if (fetchedCats.length > 0) {
          setSelectedCat(fetchedCats[0]);
        }
      } catch (error) {
        console.error("Error fetching cat data:", error);
        showAlert("Error", "Kassi andmete pärimine ebaõnnestus");
        setCats([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCats();
  }, [getUser, showAlert]);

  const renderContent = () => {
    if (isEditMode) {
      return (
        <>
          <CatSelection
            cats={cats}
            setIsEditMode={setIsEditMode}
            setSelectedCat={setSelectedCat}
          />
          <EditProfile
            setIsEditMode={setIsEditMode}
            selectedCat={selectedCat}
            setSelectedCat={setSelectedCat}
          />
        </>
      );
    }

    return (
      <>
        <CatSelection cats={cats} setSelectedCat={setSelectedCat} />
        {isLoading ? (
          <CircularProgress />
        ) : (
          <CatDetails selectedCat={selectedCat} setIsEditMode={setIsEditMode} />
        )}
      </>
    );
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col mr-4 ml-24">
        <CatProfileHeader />
        {renderContent()}
      </div>
    </div>
  );
};

export default CatProfile;
