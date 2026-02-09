import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "../services/axios";
import { CartContext } from "../components/CartContext";
import "./ShopDetails.css";

export default function ShopDetails() {
    const { shopId } = useParams();
    const { addToCart } = useContext(CartContext);

    const [shop, setShop] = useState(null);
    const [products, setProducts] = useState([]);
    const [popup, setPopup] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const shopRes = await axios.get(`/shop/${shopId}`);
                const productRes = await axios.get(`/shop/${shopId}/products`);
                setShop(shopRes.data);
                setProducts(productRes.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [shopId]);

    const handleAddToCart = (product) => {
        addToCart({
            _id: product._id,
            name: product.name,
            price: product.price,
            shopId: shop._id,
        });
        setPopup(`✅ ${product.name} added to cart`);
        setTimeout(() => setPopup(""), 2000);
    };

    if (!shop) return <p className="sd-status">Loading shop...</p>;

    return (
        <div className="sd-page">
            {/* SHOP INFO */}
            <div className="sd-header">
                <h1 className="sd-name">{shop.name}</h1>
                <p className="sd-area">{shop.area}</p>
                <p className="sd-desc">{shop.description}</p>
            </div>

            {/* TOAST POPUP */}
            {popup && <div className="sd-popup">{popup}</div>}

            {/* PRODUCTS */}
            <h2 className="sd-products-title">Available Products</h2>
            <div className="sd-product-grid">
                {products.map((product) => (
                    <div className="sd-product-card" key={product._id}>
                        <img
                            src={
                                product.image
                                    ? `${import.meta.env.VITE_BACKEND_URL}/uploads/${product.image}`
                                    : "https://via.placeholder.com/300"
                            }
                            alt={product.name}
                            className="sd-product-image"
                        />
                        <div className="sd-product-info">
                            <h3 className="sd-product-name">{product.name}</h3>
                            <p className="sd-product-desc">{product.description}</p>
                            <div className="sd-product-bottom">
                                <span className="sd-product-price">₹{product.price}</span>
                                {product.stock > 0 ? (
                                    <button
                                        className="sd-btn-add"
                                        onClick={() => handleAddToCart(product)}
                                    >
                                        Add to Cart
                                    </button>
                                ) : (
                                    <span className="sd-out-stock">Out of Stock</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
