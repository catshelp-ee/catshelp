import { Navigate, Route, Routes } from "react-router-dom";
import PageLayout from "@pages/app/PageLayout";
import Dashboard from "@pages/dashboard/Dashboard";
import AddCatForm from "@pages/add-cat/AddCatForm";
import CatProfile from "@pages/cat-profile/CatProfile";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import "@style/App.css";
import dayjs from "dayjs";
import "dayjs/locale/et.js";
import EditCat from "@pages/EditCat/EditCat.tsx";
import ProtectedRoute from "@pages/ProtectedRoute.tsx";
import LoginForm from "@pages/login/LoginForm";

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
