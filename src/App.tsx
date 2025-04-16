import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./authContext.tsx";
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
  const { getUser } = useAuth();
  const [userID, setUserID] = useState();

  useEffect(() => {
    const getUserID = async () => {
      const user = await getUser();
      setUserID(user.id);
    }

    getUserID();
  }, [])
  


  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/dashboard/${userID}`}></Navigate>}/>
      <Route path="/login" element={<LoginForm />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard/:userID" element={<Dashboard />} />
        <Route path="/edit-cat" element={<EditCat />} />
        <Route path="/cat-profile" element={<CatProfile />} />
        <Route path="/add-cat" element={<AddCatForm />} />
      </Route>
    </Routes>
  );
}

export default App;
