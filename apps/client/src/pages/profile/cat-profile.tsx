import { createProfile, Profile, Avatar } from "@catshelp/types/src/index.ts";
import { useAlert } from "@context/alert-context.tsx";
import { useIsMobile } from "@context/is-mobile-context.tsx";
import { createContextHook } from "@hooks/create-context-hook.tsx";
import { isLoadingWrapper } from "@hooks/is-loading.tsx";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import CatDetails from "./cat-details.tsx";
import CatSelection from "./cat-selection.tsx";
import EditProfile from "./edit-profile.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useAuth} from "@context/auth-context.tsx";
import {AnimalSummary} from "@interfaces/animal-summary.ts";

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
    const [animalAvatars, setAnimalAvatars] = useState<AnimalSummary[]>([]);
    const [selectedCat, setSelectedCat] = useState<Profile>(createProfile());
    const [isLoading, setIsLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const { getUser } = useAuth();
    const isMobile = useIsMobile();
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const loadUserCats = async () => {
            const user = await getUser();

            try {
                const response = await axios.get(`/api/animals/${params.id}/profile`, {
                    withCredentials: true
                });

                const profile = response.data;
                setSelectedCat(profile);

            } catch (error) {
                console.error("Error loading cat profiles:", error);
                navigate(`/cat-profile/${user.id}`);
                showAlert("Error", "Kassi andmete pärimine ebaõnnestus");
            }
        };

        async function getAvatars() {
            const response = await axios.get("/api/profile", {
                withCredentials: true
            });
            setAnimalAvatars(response.data.profiles);
        }

        const fetchAndSetCatsWithLoading = async () => {
            await isLoadingWrapper(loadUserCats, setIsLoading);
        };

        fetchAndSetCatsWithLoading();
        getAvatars();
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
                    <CatProfileHeader cats={animalAvatars} />
                    {isLoading && (<CircularProgress />)}
                    {animalAvatars.length !== 0 && (
                        <>
                            <CatSelection animalAvatars={animalAvatars} setIsEditMode={setIsEditMode} setSelectedCat={setSelectedCat} />
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
