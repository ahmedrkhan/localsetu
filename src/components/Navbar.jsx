import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../components/AuthContext";
import "../App.css";

export default function Navbar() {
  const { token, user, logout, ready } = useContext(AuthContext);
  const navigate = useNavigate();
  const role = user?.role;
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar-container">
      <div className="nav-logo" onClick={() => navigate("/")}>
        HyperLocal
      </div>

      {/* Hamburger for mobile */}
      <div
        className="nav-toggle"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Links */}
      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <Link to="/">Home</Link>
        {role !== "admin" && <Link to="/shops">Shops</Link>}
        {role !== "admin" && <Link to="/cart">Cart</Link>}
        {role !== "admin" && <Link to="/track">Track Order</Link>}
        {role === "admin" && <Link to="/admin">Admin Panel</Link>}
      </div>

      {/* Auth buttons */}
      <div className={`nav-auth ${menuOpen ? "active" : ""}`}>
        {!token || !ready ? (
          <>
            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/register")}>Register</button>
          </>
        ) : (
          <>
            <span className="nav-user">
              {user.name} ({user.role})
            </span>
            <button onClick={() => navigate("/profile")}>Profile</button>

            {role === "shopowner" && (
              <>
                <button onClick={() => navigate("/my-shop")}>My Shop</button>
                <Link className="nav-dashboard" to="/owner/dashboard">
                  Dashboard
                </Link>
              </>
            )}

            <button className="nav-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
