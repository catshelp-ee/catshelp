import { useMediaQuery } from "@hooks/use-media-query";
import { createContext, useContext } from "react";

const IsMobileContext = createContext<boolean>(false);

export const IsMobileProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <IsMobileContext.Provider value={useMediaQuery()}>
            {children}
        </IsMobileContext.Provider>
    );
};

export const useIsMobile = (): boolean => {
    return useContext(IsMobileContext);
}