import { useState, useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import axios from "../services/axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function AddProduct() {
    const { token, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        name: "",
        price: "",
        stock: "",
        description: "",
        image: null,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!user || user.role !== "shopowner") {
        return <p className="ap-error">Access denied</p>;
    }

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData();
        formData.append("name", product.name);
        formData.append("price", product.price);
        formData.append("description", product.description);
        formData.append("stock", product.stock || 0);
        formData.append("image", product.image);

        try {
            await axios.post("/products/create", formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            navigate("/my-shop");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ap-container">
            <h2 className="ap-title">Add New Product</h2>
            {error && <p className="ap-error">{error}</p>}

            <form className="ap-form" onSubmit={handleSubmit}>
                <input
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    placeholder="Name"
                    className="ap-input"
                    required
                />

                <input
                    name="price"
                    type="number"
                    value={product.price}
                    onChange={handleChange}
                    placeholder="Price"
                    className="ap-input"
                    required
                />

                <textarea
                    name="description"
                    value={product.description}
                    onChange={handleChange}
                    placeholder="Description"
                    className="ap-textarea"
                />

                <input
                    name="stock"
                    type="number"
                    value={product.stock}
                    onChange={handleChange}
                    placeholder="Stock"
                    className="ap-input"
                />

                <input
                    type="file"
                    accept="image/*"
                    className="ap-file"
                    onChange={(e) =>
                        setProduct({ ...product, image: e.target.files[0] })
                    }
                />

                <button type="submit" className="ap-btn" disabled={loading}>
                    {loading ? "Adding..." : "Add Product"}
                </button>
            </form>
        </div>
    );
}
