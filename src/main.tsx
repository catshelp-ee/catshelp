import { BrowserRouter } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import OAuth from "../oauth.json";
import { AuthProvider } from "./authContext.tsx";

createRoot(document.getElementById("root")!).render(
    <GoogleOAuthProvider clientId={OAuth.web.client_id}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="et">
            <BrowserRouter>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </BrowserRouter>
        </LocalizationProvider>
    </GoogleOAuthProvider>
);
