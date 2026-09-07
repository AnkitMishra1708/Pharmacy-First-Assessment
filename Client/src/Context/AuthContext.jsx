import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/axios.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const restoreSession = async () => {
            try {
                const { data } = await api.get("/user/get-current-user");
                setUser(data.data);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        restoreSession();
    }, []);

    useEffect(() => {
        const handleForceLogout = () => setUser(null);
        window.addEventListener("auth:logout", handleForceLogout);
        return () => window.removeEventListener("auth:logout", handleForceLogout);
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post("/user/login", { email, password });
        setUser(data.data.user);
        return data.data.user;
    };

    const register = async (payload) => {
        const { data } = await api.post("/user/register", payload);
        return data.data;
    };

    const logout = async () => {
        try {
            await api.post("/user/logout-user");
        } finally {
            setUser(null);
        }
    };

    const deleteAccount = async () => {
        await api.post("/user/delete-user");
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        deleteAccount,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};