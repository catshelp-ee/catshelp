import { Navigate, Outlet } from "react-router-dom";
import { useCookies } from "react-cookie";

const ProtectedRoute = () => {
  const [cookies, setCookie] = useCookies(["oauth"]);
  const isAuthed = cookies.oauth !== undefined;
  return isAuthed ? <Outlet /> : <Navigate to="/register" />;
};

export default ProtectedRoute;
