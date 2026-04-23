import { AlertProvider } from "@context/alert-context.tsx";
import { AuthProvider } from "@context/auth-context.tsx";
import { IsMobileProvider } from "@context/is-mobile-context.tsx";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { PostHogProviderWrapper } from "./analytics/post-hog-provider-wrapper.tsx";
import App from "./app.tsx";
import {LanguageProvider} from "@context/language-context.tsx";

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
