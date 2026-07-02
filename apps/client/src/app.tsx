import AddCatForm from '@pages/add-cat/add-cat-form.tsx';
import AdminCatProfile from '@pages/admin/admin-cat-profile.tsx';
import Admin from '@pages/admin/admin.tsx';
import PageLayout from '@pages/app/page-layout.tsx';
import Dashboard from '@pages/dashboard/dashboard.tsx';
import LoginForm from '@pages/login/login-form.tsx';
import CatProfile from '@pages/profile/cat-profile.tsx';
import ProtectedRoute from '@pages/protected-route.tsx';
import AuthStore from '@stores/AuthStore.ts';
import '@style/app.css';
import dayjs from 'dayjs';
import 'dayjs/locale/et.js';
import localeData from 'dayjs/plugin/localeData.js';
import weekday from 'dayjs/plugin/weekday.js';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';

dayjs.extend(weekday);
dayjs.extend(localeData);

function App() {
    dayjs.locale('et');
    dayjs().weekday(1);

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

    return (
        <Routes>
            <Route path="/" element={<Navigate to={HOME}></Navigate>} />
            <Route path="/login" element={<LoginForm />} />
            <Route element={<ProtectedRoute />}>
                <Route element={<PageLayout />}>
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/admin-cat-profile/:id" element={<AdminCatProfile />} />
                    <Route path={HOME} element={<Dashboard />} />
                    <Route path="/users/:userId" element={<Dashboard />} />
                    <Route path="/cat-profiles" element={<CatProfile />} />
                    <Route path="/add-cat" element={<AddCatForm />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
export const HOME = '/dashboard';
