import { useAlert } from "@context/alert-context";
import { useIsMobile } from "@context/is-mobile-context";
import { createContextHook } from "@hooks/create-context-hook";
import { isLoadingWrapper } from "@hooks/is-loading";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@context/auth-context";

interface LoadingContextType {
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const IsLoadingContext = createContext<LoadingContextType | undefined>(undefined);
export const useLoading = createContextHook(IsLoadingContext, 'useLoading');

const CatProfileList: React.FC = () => {
    const { showAlert } = useAlert();
    const [isLoading, setIsLoading] = useState(false);
    const [animals, setAnimals] = useState([]);
    const { getUser } = useAuth();
    const isMobile = useIsMobile();

    useEffect(() => {
        const loadUserCats = async () => {
            const user = await getUser();

            try {
                const response = await axios.get(`/api/animals/profiles/users/${user.id}`, {
                    withCredentials: true
                });

                setAnimals(response.data.profiles);
            } catch (error) {
                console.error("Error loading cat profiles:", error);
                showAlert("Error", "Kassi andmete pärimine ebaõnnestus");
            }
        };

        const fetchAndSetCatsWithLoading = async () => {
            await isLoadingWrapper(loadUserCats, setIsLoading);
        };

        fetchAndSetCatsWithLoading();

    }, []);

    return (
        <IsLoadingContext.Provider value={{ isLoading, setIsLoading }} >
            <div className={`flex flex-col flex-1 ${isMobile ? "mx-4" : "mx-24"}`}>
                <div className={`flex flex-col ${isMobile ? "items-center" : ""}`}>
                    {isLoading && (<CircularProgress />)}
                    <ul>
                        {
                            animals.length !== 0 && (animals.map(animal =>
                                <li>
                                    <Link
                                        key={animal.id}
                                        to={`/cat-profiles/${animal.id}`}
                                        aria-label={`Vaata ${animal.name} profiili`}
                                    >
                                        {animal.name}
                                    </Link>
                                </li>))
                        }
                    </ul>
                </div>
            </div>
        </IsLoadingContext.Provider>
    );
};

export default CatProfileList;
