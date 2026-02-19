import { Profile, ProfileHeader } from "@catshelp/types/src";
import { useAlert } from "@context/alert-context";
import { useIsMobile } from "@context/is-mobile-context";
import { createContextHook } from "@hooks/create-context-hook";
import { isLoadingWrapper } from "@hooks/is-loading";
import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import CatDetails from "./cat-details";
import ProfileTabs from "./profile-tabs";

const CatProfileHeader = ({ cats }: { cats: any }) => {
    //SELLE STIILID ON VALED
    const isMobile = useIsMobile();
    if (isMobile) {
        return (
            <>
                <section className="flex items-center my-4">
                    <h1 className="text-2xl mr-4 ">Kiisude profiilid veebis 😺</h1>
                </section>
                {cats.length === 0 ? (
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
            {cats.length === 0 ? (
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

const CatProfile: React.FC = () => {
    const { showAlert } = useAlert();
    const [cats, setCats] = useState<ProfileHeader[]>([]);
    const [selectedCat, setSelectedCat] = useState<Profile>(null);
    const isMobile = useIsMobile();

    useEffect(() => {
        const loadUserCats = async () => {
            try {
                const response = await axios.get("/api/animals/profiles", {
                    withCredentials: true
                });

                const catProfiles = response.data.profiles;
                setCats(catProfiles);
            } catch (error) {
                console.error("Error loading cat profiles:", error);
                showAlert("Error", "Kassi andmete pärimine ebaõnnestus");
                setCats([]);
            }
        };

        loadUserCats();
    }, []);

    return (
        <div className={`flex flex-col flex-1 ${isMobile ? "mx-4" : "mx-12"}`}>
            <div className={`flex flex-col ${isMobile ? "items-center" : ""}`}>

                <CatProfileHeader cats={cats} />

                {cats.length !== 0 && (
                    <>
                        <ProfileTabs cats={cats} setSelectedCat={setSelectedCat} />
                        {selectedCat && <CatDetails selectedCat={selectedCat} />}
                    </>
                )}
            </div>
        </div>
    );
};

export default CatProfile;
