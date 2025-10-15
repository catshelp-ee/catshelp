import { useAlert } from "@context/alert-context";
import { User } from "@server/user/entities/user.entity";
import axios from "axios";
import { ReactNode, createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";


type AuthContext = {
    getUser: () => Promise<User>;
    logout: () => void;
};

type AuthContextProvider = {
    children: ReactNode;
};

export const AuthContext = createContext<AuthContext>({
    getUser: () => { return null },
    logout: () => { }
});

export const AuthProvider: React.FC<AuthContextProvider> = ({ children }) => {
    const [user, setUser] = useState<User>(null);
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    const getUser = async (): Promise<User> => {
        if (user) {
            return user;
        }
        let userReq = null;
        try {
            userReq = await axios.get('/api/user');
        } catch (error) {
            showAlert('Error', "Kasutaja andmete pärimine ebaõnnestus");
            return;
        }


        setUser(userReq.data);
        return userReq.data;
    };

    const logout = async () => {
        //DO axios logout
        try {
            await axios.post("/api/logout");
        } catch (error) {
            showAlert('Error', "Väljumine ebaõnnestus");
            return;
        }
        setUser(null);
        navigate("/login");
    };

    const value = {
        getUser,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth
export const useAuth = () => useContext(AuthContext);
