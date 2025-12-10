import { createProfile, Profile } from "@catshelp/types/src";
import { useAlert } from "@context/alert-context";
import { useIsMobile } from "@context/is-mobile-context";
import { createContextHook } from "@hooks/create-context-hook";
import { isLoadingWrapper } from "@hooks/is-loading";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import CatDetails from "./cat-details";
import CatSelection from "./cat-selection";
import EditProfile from "./edit-profile";

const CatProfileHeader = ({ cats }: { cats: any }) => {
    const { isLoading, setIsLoading } = useLoading();
    const isMobile = useIsMobile();
    if (isMobile) {
        return (
            <>
                <section className="flex items-center my-4">
                    <h1 className="text-2xl mr-4 ">Kiisude profiilid veebis 😺</h1>
                </section>
                {cats.length === 0 && !isLoading ? (
                    <>
                        <h1 className="text-xl my-12">Oota, kus mu nunnud on? 😺</h1>
                        <p className="text-2xl">Sa pole veel kellelegi kodu pakkunud, ehk pakud 😉</p>
                        <img src="sleeping.webp" width={512} />
                    </>
                ) : (<>
                    <p className="text-secondary text-lg text-justify pb-8">
                        Vaata üle ja uuenda oma hoiuloomade kuulutused siin 🐾 <br />
                        Klõpsa oma karvase sõbra pildile, et alustada! 📷💖
                    </p>
                </>)}
            </>
        );
    }
    return (
        <div>
            <section className="flex my-4 items-center">
                <h1 className="text-6xl">Kiisude profiilid veebis 😺</h1>
            </section>
            {cats.length === 0 && !isLoading ? (
                <>
                    <h1 className="text-4xl my-12">Oota, kus mu nunnud on? 😺</h1>
                    <p className="text-2xl">Sa pole veel kellelegi kodu pakkunud, ehk pakud 😉</p>
                    <img src="sleeping.webp" width={512} />
                </>
            ) : (
                <>
                    <p className="text-secondary text-xl text-justify pb-8">
                        Vaata üle ja uuenda oma hoiuloomade kuulutused siin 🐾 <br />
                        Klõpsa oma karvase sõbra pildile, et alustada! 📷💖
                    </p>
                </>
            )}
        </div>
    );
};

interface LoadingContextType {
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const IsLoadingContext = createContext<LoadingContextType | undefined>(undefined);
export const useLoading = createContextHook(IsLoadingContext, 'useLoading');

const CatProfile: React.FC = () => {
    const { showAlert } = useAlert();
    const [cats, setCats] = useState<Profile[]>([]);
    const [selectedCat, setSelectedCat] = useState<Profile>(createProfile());
    const [isLoading, setIsLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const isMobile = useIsMobile();

    useEffect(() => {
        const loadUserCats = async () => {
            try {
                const response = await axios.get("/api/profile", {
                    withCredentials: true
                });

                const catProfiles = response.data.profiles;
                setCats(catProfiles);

                if (catProfiles.length > 0) {
                    setSelectedCat(catProfiles[0]);
                }
            } catch (error) {
                console.error("Error loading cat profiles:", error);
                showAlert("Error", "Kassi andmete pärimine ebaõnnestus");
                setCats([]);
            }
        };

        const fetchAndSetCatsWithLoading = async () => {
            await isLoadingWrapper(loadUserCats, setIsLoading);
        };

        fetchAndSetCatsWithLoading();
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
            <CatDetails selectedCat={selectedCat} setIsEditMode={setIsEditMode} />
        );
    };

    return (
        <IsLoadingContext.Provider value={{ isLoading, setIsLoading }} >
            <div className={`flex flex-col flex-1 ${isMobile ? "mx-4" : "mx-24"}`}>
                <div className={`flex flex-col ${isMobile ? "items-center" : ""}`}>
                    <CatProfileHeader cats={cats} />
                    {isLoading && (<CircularProgress />)}
                    {cats.length !== 0 && (
                        <>
                            <CatSelection cats={cats} setIsEditMode={setIsEditMode} setSelectedCat={setSelectedCat} />
                            <div className={`${isMobile ? "" : "flex my-4 border-2 rounded-lg p-4"} ${isEditMode ? "flex-col" : ""}`}>
                                {renderContent()}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </IsLoadingContext.Provider>
    );
};

export default CatProfile;
