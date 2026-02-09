import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import axios from "../services/axios";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";

export default function MyShop() {
    const { user, token } = useContext(AuthContext);
    const navigate = useNavigate();

    const [shop, setShop] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Guard: only shopowner allowed
    useEffect(() => {
        if (!user) return;
        if (user.role !== "shopowner") navigate("/", { replace: true });
    }, [user, navigate]);

    // Fetch shop + products
    useEffect(() => {
        if (!user || user.role !== "shopowner") return;

        const fetchData = async () => {
            try {
                const [shopRes, productsRes] = await Promise.all([
                    axios.get("/shop/my-shop", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get("/products/mine", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                setShop(shopRes.data);
                setProducts(productsRes.data);
            } catch (err) {
                console.error(err);
                alert("Failed to load shop data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, token]);

    // Delete product
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this product?")) return;

        try {
            await axios.delete(`/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts((prev) => prev.filter((p) => p._id !== id));
        } catch (err) {
            console.error(err);
            alert("Delete failed");
        }
    };

    if (loading) return <p className="clsns-loading">Loading...</p>;
    if (!shop) return <p className="clsns-no-shop">No shop found</p>;

    return (
        <div className="clsns-shop-container">
            {shop.image && (
                <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${shop.image}`}
                    alt={shop.name}
                    className="clsns-shop-image"
                />
            )}

            <h2 className="clsns-shop-name">{shop.name}</h2>

            {/* ADMIN STATUS MESSAGES */}
            {!shop.isApproved && !shop.isBlocked && (
                <p className="clsns-shop-status pending">
                    ⏳ Your shop is pending admin approval.
                    Customers cannot see it yet.
                </p>
            )}

            {shop.isBlocked && (
                <p className="clsns-shop-status blocked">
                    🚫 Your shop has been blocked by admin.
                    Contact support for details.
                </p>
            )}

            <p className="clsns-shop-detail"><strong>Address:</strong> {shop.address}</p>
            <p className="clsns-shop-detail"><strong>Area:</strong> {shop.area}</p>
            <p className="clsns-shop-detail"><strong>Description:</strong> {shop.description}</p>

            <Link to="/add-product">
                <button className="clsns-btn-add">Add New Product</button>
            </Link>

            <h3 className="clsns-products-title">My Products</h3>
            {products.length === 0 && <p className="clsns-no-products">No products yet</p>}

            <div className="clsns-products-list">
                {products.map((product) => (
                    <div key={product._id} className="clsns-product-card">
                        {product.image && (
                            <img
                                src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${shop.image}`}
                                alt={product.name}
                                className="clsns-product-image"
                            />
                        )}
                        <h4 className="clsns-product-name">{product.name}</h4>
                        <p className="clsns-product-price">₹{product.price}</p>
                        <p className="clsns-product-stock">Stock: {product.stock}</p>

                        <button
                            className="clsns-btn-edit"
                            onClick={() => navigate(`/edit-product/${product._id}`)}
                        >
                            Edit
                        </button>
                        <button
                            className="clsns-btn-delete"
                            onClick={() => handleDelete(product._id)}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
