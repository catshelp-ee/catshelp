import { AlertProvider } from "@context/alert-context";
import { AuthProvider } from "@context/auth-context";
import { IsMobileProvider } from "@context/is-mobile-context";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { PostHogProviderWrapper } from "./analytics/post-hog-provider-wrapper";
import App from "./app";
import {LanguageProvider} from "@context/language-context";

createRoot(document.getElementById("container")!).render(
    <PostHogProviderWrapper>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="et">
                <BrowserRouter>
                    <AlertProvider>
                        <AuthProvider>
                            <IsMobileProvider>
                                <LanguageProvider>
                                    <App />
                                </LanguageProvider>
                            </IsMobileProvider>
                        </AuthProvider>
                    </AlertProvider>
                </BrowserRouter>
            </LocalizationProvider>
        </GoogleOAuthProvider>
    </PostHogProviderWrapper>
);
