import { Navigate, Route, Routes } from "react-router-dom";
import PageLayout from "./pages/App/PageLayout.tsx";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import AddCatForm from "./pages/AddCat/AddCatForm.tsx";
import CatProfile from "./pages/CatProfile/CatProfile.tsx";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import "@style/App.css";
import dayjs from "dayjs";
import "dayjs/locale/et.js";
import EditCat from "./pages/EditCat/EditCat.tsx";
import ProtectedRoute from "./pages/ProtectedRoute.tsx";
import LoginForm from "./pages/Login/LoginForm.tsx";

dayjs.extend(weekday);
dayjs.extend(localeData);

function App() {
  dayjs.locale("et");
  dayjs().weekday(1);


  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard"></Navigate>} />
      <Route path="/login" element={<LoginForm />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<PageLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/edit-cat" element={<EditCat />} />
          <Route path="/cat-profile" element={<CatProfile />} />
        </Route>
        <Route path="/add-cat" element={<AddCatForm />} />
      </Route>
    </Routes>
  );
}

export default App;
