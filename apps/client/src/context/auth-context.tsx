import type { User } from '@interfaces/user.ts';
import { useAlert } from '@context/alert-context.tsx';
import axios from 'axios';
import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type AuthContext = {
    getUser: () => Promise<User>;
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
    const [user, setUser] = useState<User>(null);
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    const getUser = async (): Promise<User> => {
        if (user) {
            return user;
        }
        try {
            const userReq = await axios.get('/api/users/me');
            setUser(userReq.data);
            return userReq.data;
        } catch (_error) {
            showAlert('Error', 'Kasutaja andmete pärimine ebaõnnestus');
            return;
        }
    };

    const logout = async () => {
        //DO axios logout
        try {
            await axios.post('/api/auth/logout');
        } catch (_error) {
            showAlert('Error', 'Väljumine ebaõnnestus');
            return;
        }
        setUser(null);
        navigate('/login');
    };

    const checkIfAdmin = async () => {
        const user = await getUser();

        return user.role === 'ADMIN';
    };

    const value = {
        getUser,
        logout,
        checkIfAdmin,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth
export const useAuth = () => useContext(AuthContext);
