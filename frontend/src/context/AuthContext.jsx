import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // on first load (later we will add "check session")
    useEffect(() => {
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await api.post("/login", { email, password });
        setUser(res.data.user);
        return res.data.user;
    };

    const register = async (username, email, password) => {
        const res = await api.post("/register", { username, email, password });
        setUser(res.data.user);
        return res.data.user;
    };

    const logout = async () => {
        await api.post("/logout");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
