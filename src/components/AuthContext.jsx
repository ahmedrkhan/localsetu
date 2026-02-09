import { createContext, useState, useEffect } from "react";
import axios from "../services/axios";

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);
    const [loading, setLoading] = useState(true);
    

    const login = (token, userData) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setToken(token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    };

    useEffect(() => {
        const loadUser = async () => {
            if (!token) {
                setReady(true);
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get("/auth/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setUser(res.data);
                localStorage.setItem("user", JSON.stringify(res.data));
            } catch (err) {
                logout(); // token invalid → force logout
            } finally {
                setReady(true);
            }
        };

        loadUser();
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, user, login, logout, ready, setUser, setToken ,loading}}>
            {ready ? children : null}
        </AuthContext.Provider>
    );
};
