import { Navigate, Route, Routes } from "react-router-dom";
import PageLayout from "@pages/app/page-layout";
import Dashboard from "@pages/dashboard/dashboard";
import AddCatForm from "@pages/add-cat/add-cat-form";
import CatProfile from "@pages/cat-profile/cat-profile";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import "@style/app.css";
import dayjs from "dayjs";
import "dayjs/locale/et.js";
import ProtectedRoute from "@pages/protected-route";
import LoginForm from "@pages/login/login-form";

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
          <Route path="/cat-profile" element={<CatProfile />} />
        </Route>
        <Route path="/add-cat" element={<AddCatForm />} />
      </Route>
    </Routes>
  );
}

export default App;
