import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export default function AdminProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  if (!user || user.role !== "admin") return <Navigate to="/login" replace />;
  return children;
}
