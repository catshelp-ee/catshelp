import { BrowserRouter } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AuthProvider } from "@context/AuthContext";
import { AlertProvider } from "@context/AlertContext.tsx";
import { PostHogProviderWrapper } from "./analytics/PostHogProviderWrapper.tsx";
console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID);
createRoot(document.getElementById("root")!).render(
  <PostHogProviderWrapper>
    <GoogleOAuthProvider clientId={"683064775627-ijeh78do11kijfs9rinnmbaraocgoc7i.apps.googleusercontent.com"}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="et">
        <BrowserRouter>
          <AlertProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </AlertProvider>
        </BrowserRouter>
      </LocalizationProvider>
    </GoogleOAuthProvider>
  </PostHogProviderWrapper>
);
