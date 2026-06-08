import type { IUser } from '@catshelp/types/src/index.ts';
import { useAlert } from '@context/alert-context.tsx';
import axios from 'axios';
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

type AuthContext = {
    getUser: () => Promise<IUser>;
    logout: () => void;
    checkIfAdmin: () => boolean;
};

type AuthContextProvider = {
    children: ReactNode;
};

export const AuthContext = createContext<AuthContext>({
    getUser: () => {
        return null;
    },
    logout: () => {},
    checkIfAdmin: () => {
        return null;
    },
});

export const AuthProvider: React.FC<AuthContextProvider> = ({ children }) => {
    const userRef = useRef<IUser>(null);
    const loggingOutRef = useRef(false);
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    const getUser = useCallback(async (): Promise<IUser> => {
        if (loggingOutRef.current) {
            return null;
        }
        if (userRef.current) {
            return userRef.current;
        }
        try {
            const userReq = await axios.get('/api/user');
            userRef.current = userReq.data;
            return userReq.data;
        } catch (_error) {
            showAlert('Error', 'Kasutaja andmete pärimine ebaõnnestus');
            return;
        }
    }, [showAlert]);

    const logout = useCallback(async () => {
        if (loggingOutRef.current) {
            return;
        }
        loggingOutRef.current = true;
        try {
            await axios.post('/api/auth/logout');
        } catch (_error) {
            loggingOutRef.current = false;
            showAlert('Error', 'Väljumine ebaõnnestus');
            return;
        }
        userRef.current = null;
        navigate('/login');
        loggingOutRef.current = false;
    }, [navigate, showAlert]);

    const checkIfAdmin = useCallback(async () => {
        const user = await getUser();

        return user?.role === 'ADMIN';
    }, [getUser]);

    const value = useMemo(() => ({ getUser, logout, checkIfAdmin }), [getUser, logout, checkIfAdmin]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth
export const useAuth = () => useContext(AuthContext);
