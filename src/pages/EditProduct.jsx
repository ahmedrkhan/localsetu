import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../services/axios";
import "../App.css";

export default function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        axios.get(`/products/${id}`)
            .then(res => {
                setName(res.data.name);
                setPrice(res.data.price);
                setStock(res.data.stock);
            })
            .catch(err => setError("Failed to load product"));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("stock", stock);
        if (image) formData.append("image", image);

        try {
            await axios.put(`/products/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            navigate("/my-shop");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ep-container">
            <h2 className="ep-title">Edit Product</h2>
            {error && <p className="ep-error">{error}</p>}
            <form className="ep-form" onSubmit={handleSubmit}>
                <input
                    className="ep-input"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Product Name"
                    required
                />
                <input
                    className="ep-input"
                    type="number"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    placeholder="Price"
                    required
                />
                <input
                    className="ep-input"
                    type="number"
                    value={stock}
                    onChange={e => setStock(e.target.value)}
                    placeholder="Stock"
                    required
                />
                <input
                    className="ep-file"
                    type="file"
                    accept="image/*"
                    onChange={e => setImage(e.target.files[0])}
                />
                <button className="ep-btn" type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Product"}
                </button>
            </form>
        </div>
    );
}
