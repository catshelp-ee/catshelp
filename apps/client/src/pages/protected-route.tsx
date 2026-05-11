import Cookies from 'js-cookie';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const loginCookie = Cookies.get('catshelp');
    return loginCookie ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
