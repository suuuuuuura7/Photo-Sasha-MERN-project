import api from "../api/axios.js";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshsession = useEffect(async () => {
        try {
            const { data } = await api.get('/auth/me');
            setUser(data.user);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshsession();
    }, [refreshsession]);

    const register = async (name, email, password) => {
        const { data } = await api.post('/auth/register', { name, email, password });
        setUser(data.user);
        return data.user;
    };

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        setUser(data.user);
        return data.user;
    };

    const logout = async () => {
        await api.post('/auth/logout');
        setUser(null);
    };

    const loginWithGoogle = () => {
        window.location.href = 'http://localhost:5002/api/auth/googleAuth';
    };

    const value = {
        user,
        isAuthenticated: Boolean(user),
        loading,
        register,
        login,
        logout,
        loginWithGoogle,
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
