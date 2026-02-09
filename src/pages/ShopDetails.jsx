import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "../services/axios";
import { CartContext } from "../components/CartContext";
import "../App.css";
import { BACKEND_URL } from "../config";


export default function ShopDetails() {
  const { shopId } = useParams();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [popup, setPopup] = useState("");
  const { addToCart } = useContext(CartContext);
  const [selectedProduct, setSelectedProduct] = useState(null);


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
    setPopup(`${product.name} added to cart`);
    setTimeout(() => setPopup(""), 2000);
  };

  if (!shop) return <p className="shopdetails-status">Loading shop...</p>;

  return (
    <div className="shopdetails-page">
      {/* SHOP INFO */}
      <div className="shopdetails-header">
        <h1>{shop.name}</h1>
        <p className="shopdetails-area">{shop.area}</p>
        <p className="shopdetails-desc">{shop.description}</p>
      </div>

      {/* POPUP */}
      {popup && <div className="shopdetails-popup">{popup}</div>}

      {/* PRODUCTS */}
      {/* PRODUCTS */}
      <h2 className="section-title">Available Products</h2>

      <div className="product-row">
        {products.map((p) => (
          <div className="product-card" key={p._id}>
            <img
              src={
                p.image
                  ? `${BACKEND_URL}/uploads/${p.image}`
                  : "https://via.placeholder.com/300"
              }
              alt={p.name}
              onClick={() => setSelectedProduct(p)}
              className="clickable-img"
            />

            <div className="product-info">
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              <div className="product-bottom">
                <span className="price">₹{p.price}</span>
                {p.stock > 0 ? (
                  <button onClick={() => handleAddToCart(p)}>Add</button>
                ) : (
                  <span className="out">Out of Stock</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedProduct && (
        <div className="img-modal" onClick={() => setSelectedProduct(null)}>
          <div
            className="img-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={
                selectedProduct.image
                  ? `${BACKEND_URL}/uploads/${selectedProduct.image}`
                  : "https://via.placeholder.com/600"
              }

              alt={selectedProduct.name}
            />
            <h3>{selectedProduct.name}</h3>
            <p>{selectedProduct.description}</p>
            <span>₹{selectedProduct.price}</span>
            <button onClick={() => setSelectedProduct(null)}>Close</button>
          </div>
        </div>
      )}


    </div>
  );
}
