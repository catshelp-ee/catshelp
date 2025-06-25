import { createContextHook } from "@hooks/createContextHook.js";
import { useMediaQuery } from "@hooks/useMediaQuery";
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