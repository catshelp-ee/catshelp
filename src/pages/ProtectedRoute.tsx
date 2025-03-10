import { Navigate, Outlet } from "react-router-dom";
import Cookies from 'js-cookie';

const ProtectedRoute = () => {
  const loginCookie = Cookies.get('catshelp');
  return loginCookie ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
