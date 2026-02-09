import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Navigate } from "react-router-dom";

export default function OwnerRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;              // wait for auth
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "owner") return <Navigate to="/" replace />;

  return children;
}
