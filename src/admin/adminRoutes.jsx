import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import AdminProtectedRoute from "../components/AdminProtectionRoutes";
import AdminDashboard from "./pages/AdminDashboard";
import AdminShops from "./pages/AdminShops";
import AdminUsers from "./pages/AdminUsers";

// Admin layout with navbar
function AdminLayout() {
  return (
    <>
      <Outlet /> {/* Admin pages render here */}
    </>
  );
}

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="shops" element={<AdminShops />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="*" element={<Navigate to="dashboard" />} />
      </Route>
    </Routes>
  );
}
