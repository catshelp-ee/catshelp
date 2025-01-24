import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import AddCatForm from "./pages/AddCat/AddCatForm.tsx";
import CatProfile from "./pages/CatProfile/CatProfile.tsx";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import "./App.css";
import dayjs from "dayjs";
import "dayjs/locale/et.js";
import Login from "./pages/Login.tsx";
import EditCat from "./pages/EditCat/EditCat.tsx";
import RegisterForm from "./pages/Register/RegisterForm.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { CookiesProvider } from "react-cookie";
import OAuth from "../oauth.json";

dayjs.extend(weekday);
dayjs.extend(localeData);

function App() {
  dayjs.locale("et");
  dayjs().weekday(1);

  return (
    <GoogleOAuthProvider clientId={OAuth.web.client_id}>
      <CookiesProvider defaultSetOptions={{ path: "/" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="et">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/edit-cat" element={<EditCat />} />
              <Route path="/cat-profile" element={<CatProfile />} />
              <Route path="/add-cat" element={<AddCatForm />} />
            </Routes>
          </BrowserRouter>
        </LocalizationProvider>
      </CookiesProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
