import { Profile, ProfileHeader } from "@catshelp/types/src";
import { useAlert } from "@context/alert-context";
import { useIsMobile } from "@context/is-mobile-context";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CatDetails from "./cat-details";
import ProfileTabs from "./profile-tabs";

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
        <div className={`flex flex-col flex-1`}>
            <div className={`flex flex-col ${isMobile ? "items-center" : ""}`}>
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
