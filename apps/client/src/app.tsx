import AddCatForm from "@pages/add-cat/add-cat-form";
import Admin from "@pages/admin/admin";
import PageLayout from "@pages/app/page-layout";
import Dashboard from "@pages/dashboard/dashboard";
import LoginForm from "@pages/login/login-form";
import CatProfile from "@pages/profile/cat-profile";
import ProtectedRoute from "@pages/protected-route";
import "@style/app.css";
import dayjs from "dayjs";
import "dayjs/locale/et.js";
import localeData from "dayjs/plugin/localeData";
import weekday from "dayjs/plugin/weekday";
import { Navigate, Route, Routes } from "react-router-dom";

dayjs.extend(weekday);
dayjs.extend(localeData);

function App() {
    dayjs.locale("et");
    dayjs().weekday(1);

    return (
        <Routes>
            <Route path="/" element={<Navigate to={HOME}></Navigate>} />
            <Route path="/login" element={<LoginForm />} />
            <Route element={<ProtectedRoute />}>
                <Route element={<PageLayout />}>
                    <Route path="/admin" element={<Admin />} />
                    <Route path={HOME} element={<Dashboard />} />
                    <Route path="/users/:userId" element={<Dashboard />} />
                    <Route path="/cat-profile/:id" element={<CatProfile />} />
                    <Route path="/users/animals/profile" element={<CatProfile />} />
                    <Route path="/users/:userId/animals/:animalId/profile" element={<CatProfile />} />
                    <Route path="/add-cat" element={<AddCatForm />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
export const HOME = "/users";
