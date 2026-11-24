import AuthStore from '@stores/AuthStore.ts';
import Cookies from 'js-cookie';
import { Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';

const ProtectedRoute = () => {
    const loginCookie = Cookies.get('catshelp');

    // Load assets only when logged in; otherwise we redirect to /login
    useEffect(() => {
        if (!loginCookie) {
            return;
        }

        AuthStore.initialize().catch(error => {
            console.error('Error loading assets:', error);
        });
    }, [loginCookie]);

    return loginCookie ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
