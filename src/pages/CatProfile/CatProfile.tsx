import React, { useEffect, useState } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { useMediaQuery } from "@mui/material";
import { useAlert } from "@context/AlertContext";
import { useAuth } from "@context/AuthContext.tsx";
import CatSelection from "./CatSelection.tsx";
import CatDetails from "./CatDetails.tsx";
import EditProfile from "./EditProfile.tsx";
import { Cat, defaultCat } from "@models/Cat.ts";
import { useIsMobile } from "@hooks/isMobile";

const CatProfileHeader = ({ isMobile }: { isMobile: boolean }) => {
  if (isMobile) {
    return (
      <>
        <section className="flex items-center my-4">
          <h1 className="text-xl mr-4 ">Kiisude profiilid veebis</h1>
          <img
            loading="lazy"
            src="/welcome.svg"
            height={28}
            width={28}
            alt="Welcome"
          />
        </section>
        <p className="text-secondary text-justify px-8 leading-7">
          Siin näed ja saad muuta oma hoiulooma(de) kuulutus(i) catshelp.ee
          veebilehel Valimiseks klõpsa hoiulooma pildil
        </p>
      </>
    );
  }
  return (
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
};

const CatProfile: React.FC = () => {
  const { getUser } = useAuth();
  const { showAlert } = useAlert();
  const [cats, setCats] = useState<Cat[]>([]);
  const [selectedCat, setSelectedCat] = useState<Cat>(defaultCat);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const isMobile = useIsMobile();

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

        let fetchedCats;
        if (response.data.source === "cache"){
          fetchedCats = response.data.data.profiles;
        } else{
          fetchedCats = response.data.profiles;
        }

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
  }, []);

  const renderContent = () => {
    if (isEditMode) {
      return (
          <EditProfile
            setIsEditMode={setIsEditMode}
            selectedCat={selectedCat}
            setSelectedCat={setSelectedCat}
          />
      );
    }

    return (
      <>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <CatDetails selectedCat={selectedCat} setIsEditMode={setIsEditMode} />
        )}
      </>
    );
  };

  return (
    <div className={`flex flex-col flex-1 ${isMobile ? "mx-4" : "mx-24"}`}>
      <div className={`flex flex-col ${isMobile ? "items-center" : ""}`}>
        <CatProfileHeader isMobile={isMobile} />
        <CatSelection cats={cats} setIsEditMode={setIsEditMode} setSelectedCat={setSelectedCat}/>
        <div className={`${isMobile ? "" : "flex my-4 border-2 rounded-lg p-4"} ${isEditMode ? "flex-col" : ""}`}>
         {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default CatProfile;
