import React, { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { CookiesProvider } from "react-cookie";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import OAuth from "../oauth.json";

createRoot(document.getElementById("root")!).render(
    <GoogleOAuthProvider clientId={OAuth.web.client_id}>
        <CookiesProvider defaultSetOptions={{ path: "/" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="et">
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </LocalizationProvider>
        </CookiesProvider>
    </GoogleOAuthProvider>,
);
