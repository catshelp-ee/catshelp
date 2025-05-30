import { BrowserRouter } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import OAuth from "../oauth.json";
import { AuthProvider } from "@context/AuthContext";
import { AlertProvider } from "@context/AlertContext.tsx";
import { PostHogProviderWrapper } from "./analytics/PostHogProviderWrapper.tsx";

createRoot(document.getElementById("root")!).render(
  <PostHogProviderWrapper>
    <GoogleOAuthProvider clientId={OAuth.web.client_id}>
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
