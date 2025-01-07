import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import AddCatForm from "./pages/AddCatForm.tsx";
import CatProfile from "./pages/CatProfile/CatProfile.tsx";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import "./App.css";
import dayjs from "dayjs";
import "dayjs/locale/et.js";
import Login from "./pages/Login.tsx";
import AddCat from "./pages/AddCat/AddCat.tsx";

dayjs.extend(weekday);
dayjs.extend(localeData);

function App() {
  dayjs.locale("et");
  dayjs().weekday(1);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="et">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-cat" element={<AddCat />} />
          <Route path="/cat-profile" element={<CatProfile />} />
        </Routes>
      </BrowserRouter>
    </LocalizationProvider>
  );
}

export default App;
