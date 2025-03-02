import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const logout = async () => {
        //DO axios logout
        await axios.post("/api/logout");
        setUser(null);
        navigate("/login");
    };

    const value = {
        user,
        setUser,
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