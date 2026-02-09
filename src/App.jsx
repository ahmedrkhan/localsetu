import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Shops from "./pages/Shops";
import Cart from "./pages/Cart";
import TrackOrder from "./pages/TrackOrder";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import MyShop from "./pages/MyShop";
import ShopSetup from "./pages/ShopSetup";
import AddProduct from "./pages/AddProduct";
import ProtectedRoute from "./components/ProtectedRoute";
import ShopDetails from "./pages/ShopDetails";
import { CartProvider } from "./components/CartContext";
import AdminRoutes from "./admin/adminRoutes";
import EditProduct from "./pages/EditProduct";

function AppWrapper() {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/admin"); // Hide main navbar on admin routes

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/shops" element={<Shops />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/track" element={<TrackOrder />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/shop/:shopId" element={<ShopDetails />} />

        {/* User Protected */}
        <Route path="/my-shop" element={<ProtectedRoute><MyShop /></ProtectedRoute>} />
        <Route path="/shop/setup" element={<ProtectedRoute><ShopSetup /></ProtectedRoute>} />
        <Route path="/add-product" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />

        {/* Owner */}
        <Route path="/owner/dashboard" element={<Dashboard />} />
        <Route path="/edit-product/:id" element={
          <ProtectedRoute>
            <EditProduct />
          </ProtectedRoute>
        }
        />


        {/* Admin */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Router>
        <AppWrapper />
      </Router>
    </CartProvider>
  );
}
