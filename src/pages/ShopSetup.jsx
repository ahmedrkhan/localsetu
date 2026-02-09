import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../components/AuthContext";
import axios from "../services/axios";
import { useNavigate } from "react-router-dom";
import "../App.css"; // separate CSS file

export default function ShopSetup() {
    const { user, token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [shop, setShop] = useState({
        name: "",
        address: "",
        area: "",
        pincode: "",
        description: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [shopExists, setShopExists] = useState(false);

    useEffect(() => {
        if (!user || user.role !== "shopowner") {
            navigate("/", { replace: true });
            return;
        }

        const fetchShop = async () => {
            try {
                const res = await axios.get("/shop/my-shop", { headers: { Authorization: `Bearer ${token}` } });
                if (res.data) {
                    setShop(res.data);
                    setShopExists(true);
                }
            } catch (err) {
                if (err.response?.status !== 404) console.error(err);
            }
        };

        fetchShop();
    }, [user, token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("name", shop.name);
            formData.append("address", shop.address);
            formData.append("area", shop.area);
            formData.append("pincode", shop.pincode);
            formData.append("description", shop.description);
            if (file) formData.append("image", file);

            const config = { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } };
            let res;
            if (shopExists) {
                res = await axios.put("/shop/update", formData, config);
            } else {
                res = await axios.post("/shop/setup", formData, config);
                setShopExists(true);
            }

            setShop(res.data);
            navigate("/my-shop?status=pending", { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save shop");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="shop-setup-wrapper">
            <h2 className="shop-setup-title">{shopExists ? "Edit Shop" : "Setup Your Shop"}</h2>
            {error && <p className="shop-setup-error">{error}</p>}
            <form className="shop-setup-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="shop-setup-input"
                    placeholder="Shop Name"
                    value={shop.name}
                    onChange={(e) => setShop({ ...shop, name: e.target.value })}
                    required
                />
                <input
                    type="text"
                    className="shop-setup-input"
                    placeholder="Address"
                    value={shop.address}
                    onChange={(e) => setShop({ ...shop, address: e.target.value })}
                />
                <input
                    type="text"
                    className="shop-setup-input"
                    placeholder="Area / City"
                    value={shop.area}
                    onChange={(e) => setShop({ ...shop, area: e.target.value })}
                />
                <input
                    type="text"
                    className="shop-setup-input"
                    placeholder="Pincode"
                    value={shop.pincode}
                    onChange={(e) => setShop({ ...shop, pincode: e.target.value })}
                    required
                />
                <textarea
                    className="shop-setup-textarea"
                    placeholder="Description (optional)"
                    value={shop.description}
                    onChange={(e) => setShop({ ...shop, description: e.target.value })}
                />
                <input
                    type="file"
                    className="shop-setup-file"
                    name="image"
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <button type="submit" className="shop-setup-btn" disabled={loading}>
                    {loading ? "Saving..." : shopExists ? "Update Shop" : "Save Shop"}
                </button>
            </form>
        </div>
    );
}
