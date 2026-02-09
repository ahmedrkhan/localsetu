import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Home() {
  const [pincode, setPincode] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!pincode.trim()) {
      setError(true);
      return;
    }
    setError(false);
    navigate(`/shops?pincode=${encodeURIComponent(pincode)}`);
  };

  return (
    <div className="home-container">
      {/* HERO */}
      <section className="hero-section">
        <h1>Hyper-Local Delivery</h1>
        <p className="subtitle">
          Order essentials and groceries from nearby shops — fast, reliable, and local.
        </p>
        <div className="search-box">
          <input
            type="text"
            placeholder="Enter your area or pin code"
            value={pincode}
            className={error ? "error" : ""}
            onChange={(e) => setPincode(e.target.value)}
          />
          <button onClick={handleSearch}>Find Nearby Shops</button>
        </div>
        {error && <p style={{ color: "#ef4444", marginTop: "6px" }}>Enter your area or pin code</p>}
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <h2>What you get</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Local Shops</h3>
            <p>Support neighborhood businesses and get fresher products faster.</p>
          </div>
          <div className="feature-card">
            <h3>Fast Delivery</h3>
            <p>Orders delivered within hours — not days.</p>
          </div>
          <div className="feature-card">
            <h3>Live Tracking</h3>
            <p>Track your order from shop to doorstep in real-time.</p>
          </div>
          <div className="feature-card">
            <h3>Secure Payments</h3>
            <p>Safe checkout with trusted payment methods.</p>
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="steps-section">
        <h2>How it works</h2>
        <div className="steps">
          <div className="step">
            <span>1</span>
            <p>Enter area or pin code</p>
          </div>
          <div className="step">
            <span>2</span>
            <p>Select a nearby shop</p>
          </div>
          <div className="step">
            <span>3</span>
            <p>Add products to cart</p>
          </div>
          <div className="step">
            <span>4</span>
            <p>Place order & track delivery</p>
          </div>
        </div>
      </section>

      {/* SHOP OWNER CTA */}
      <section className="cta-section">
        <h2>Are you a shop owner?</h2>
        <p>List your shop, add products, and reach customers in your area.</p>
        <button onClick={() => navigate("/register")}>Register Your Shop</button>
      </section>

      {/* WHY US */}
      <section className="why-us">
        <h2>Why choose Hyper-Local Delivery?</h2>
        <ul>
          <li>No big warehouses — directly from local shops</li>
          <li>Lower delivery time & fresher items</li>
          <li>Built for both customers and shop owners</li>
        </ul>
      </section>
    </div>
  );
}
