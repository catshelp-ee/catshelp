import { Profile } from "@catshelp/types/src";
import { useAlert } from "@context/alert-context";
import { useIsMobile } from "@context/is-mobile-context";
import { createContextHook } from "@hooks/create-context-hook";
import { isLoadingWrapper } from "@hooks/is-loading";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import AdminCatDetails from "./admin-cat-details";
import {useParams} from "react-router-dom";

interface LoadingContextType {
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const IsLoadingContext = createContext<LoadingContextType | undefined>(undefined);
export const useLoading = createContextHook(IsLoadingContext, 'useLoading');

const AdminCatProfile: React.FC = () => {
    const { showAlert } = useAlert();
    const [selectedCat, setSelectedCat] = useState<Profile>(null);
    const [isLoading, setIsLoading] = useState(false);
    const isMobile = useIsMobile();
    const params = useParams();

    useEffect(() => {
        const loadCat = async () => {
            try {
                const response = await axios.get(`/api/animals/${params.id}/profile/`, {
                    withCredentials: true
                });

                const profile = response.data;
                setSelectedCat(profile);
            } catch (error) {
                console.error("Error loading cat profiles:", error);
                showAlert("Error", "Kassi andmete pärimine ebaõnnestus");
            }
        };

        const fetchAndSetCatsWithLoading = async () => {
            await isLoadingWrapper(loadCat, setIsLoading);
        };

        fetchAndSetCatsWithLoading();
    }, []);

    return (
        <IsLoadingContext.Provider value={{ isLoading, setIsLoading }} >
            <div className={`flex flex-col flex-1 ${isMobile ? "mx-4" : "mx-24"}`}>
                <div className={`flex flex-col ${isMobile ? "items-center" : ""}`}>
                    {isLoading && (<CircularProgress />)}
                    {selectedCat != null && (<AdminCatDetails selectedCat={selectedCat} />)}
                </div>
            </div>
        </IsLoadingContext.Provider>
    );
};

export default AdminCatProfile;
