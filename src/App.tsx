import React, { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import AddCatForm from "./pages/AddCat/AddCatForm.tsx";
import CatProfile from "./pages/CatProfile/CatProfile.tsx";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import "./App.css";
import dayjs from "dayjs";
import "dayjs/locale/et.js";
import Login from "./pages/Login.tsx";
import EditCat from "./pages/EditCat/EditCat.tsx";
import RegisterForm from "./pages/Register/RegisterForm.tsx";
import ProtectedRoute from "./pages/ProtectedRoute.tsx";

dayjs.extend(weekday);
dayjs.extend(localeData);

function App() {
  dayjs.locale("et");
  dayjs().weekday(1);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/edit-cat" element={<EditCat />} />
        <Route path="/cat-profile" element={<CatProfile />} />
        <Route path="/add-cat" element={<AddCatForm />} />
      </Route>
    </Routes>
  );
}

export default App;
