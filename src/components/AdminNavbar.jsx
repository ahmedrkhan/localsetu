import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export default function AdminNavbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    if (!user || user.role !== "admin") return null;

    const handleLogout = () => {
        logout();
        localStorage.removeItem("token");
        navigate("/login");
    };

    const isActive = (path) => location.pathname.startsWith(path);

    return (
        <aside className="admin-navbar">
            <div className="admin-brand">
                <h2>Admin Panel</h2>
            </div>

            <nav className="navbar-links">
                <Link
                    to="/admin/dashboard"
                    className={isActive("/admin/dashboard") ? "active" : ""}
                >
                    Dashboard
                </Link>

                <Link
                    to="/admin/shops"
                    className={isActive("/admin/shops") ? "active" : ""}
                >
                    Manage Shops
                </Link>

                <Link
                    to="/admin/users"
                    className={isActive("/admin/users") ? "active" : ""}
                >
                    Manage Users
                </Link>
            </nav>

            <div className="navbar-footer">
                <span className="admin-user">👋 {user.name}</span>
                <button onClick={handleLogout} className="logout-btn">
                    Logout
                </button>
            </div>
        </aside>
    );
}
