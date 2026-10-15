import AuthStore from '@stores/AuthStore.ts';
import Cookies from 'js-cookie';
import { Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';

const ProtectedRoute = () => {

        // Load assets
    useEffect(() => {
        const loadAssets = async () => {
            try {
                // Load the assets
                await Promise.all([
                    // Initialize AuthStore
                    AuthStore.initialize(),
                ]);
            } catch (error) {
                console.error('Error loading assets:', error);
            }
        };

        void loadAssets();
    }, []);

    const loginCookie = Cookies.get('catshelp');
    return loginCookie ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
