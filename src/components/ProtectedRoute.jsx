import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export default function ProtectedRoute({ children }) {
    const { token, ready } = useContext(AuthContext);

    if (!ready) return null;
    if (!token) return <Navigate to="/login" />;

    return children;
}
