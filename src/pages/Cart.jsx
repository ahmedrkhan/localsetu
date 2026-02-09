import { useContext, useEffect, useState } from "react";
import { CartContext } from "../components/CartContext";
import axios from "../services/axios";
import "../App.css";

export default function Cart() {
  const { cartItems, setCartItems, clearCart } = useContext(CartContext);

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [shop, setShop] = useState(null);
  const [order, setOrder] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (!cartItems.length) return;
    axios
      .get(`/shop/${cartItems[0].shopId}`)
      .then(res => setShop(res.data))
      .catch(() => console.error("Shop load failed"));
  }, [cartItems]);

  const total = cartItems.reduce((sum, i) => sum + i.qty * i.price, 0);

  const updateQty = (id, delta) => {
    setCartItems(prev =>
      prev.map(i =>
        i._id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i
      )
    );
  };

  const removeItem = id =>
    setCartItems(prev => prev.filter(i => i._id !== id));

  const handleCheckout = async () => {
    if (!token) return alert("Login required");
    if (!address.trim() || !phone.trim())
      return alert("Address & phone required");

    setLoading(true);
    try {
      const res = await axios.post(
        "/orders/create",
        {
          items: cartItems,
          total,
          shopId: cartItems[0].shopId,
          address,
          phone,
          paymentType: "Cash on Delivery",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("ORDER RESPONSE:", res.data);
      console.log("ORDER ID:", res.data._id);

      setOrder(res.data);

      // 🔑 Persist last order for TrackOrder
      localStorage.setItem("lastOrderId", res.data._id);

      // Optional: push new order into localStorage orderHistory
      const history = JSON.parse(localStorage.getItem("orderHistory")) || [];
      const updatedHistory = [res.data._id, ...history.filter(id => id !== res.data._id)].slice(0, 5);
      localStorage.setItem("orderHistory", JSON.stringify(updatedHistory));

      clearCart();
      localStorage.removeItem("cart");
    } catch {
      alert("Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-page">
      <h1 className="cart-title">Shopping Cart</h1>

      {shop && (
        <div className="cart-shop">
          <p><b>Shop:</b> {shop.name}</p>
          <p><b>Address:</b> {shop.address}</p>
        </div>
      )}

      {cartItems.length === 0 && !order && (
        <p className="cart-empty">Your cart is empty</p>
      )}

      {cartItems.length > 0 && (
        <>
          <div className="cart-items">
            {cartItems.map(item => (
              <div className="cart-item" key={item._id}>
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p>₹{item.price} × {item.qty}</p>
                </div>

                <div className="cart-actions">
                  <button onClick={() => updateQty(item._id, -1)}>−</button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item._id, 1)}>+</button>
                  <button
                    className="cart-remove"
                    onClick={() => removeItem(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-checkout">
            <div className="cart-inputs">
              <input
                placeholder="Delivery address"
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
              <input
                placeholder="Phone number"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>

            <div className="cart-summary">
              <h2>Total: ₹{total}</h2>
              <button onClick={handleCheckout} disabled={loading}>
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        </>
      )}

      {order && (
        <div className="order-summary">
          <h2>Order Placed Successfully ✅</h2>

          <div className="order-box">
            <p>
              <b>Order ID:</b>{" "}
              <span style={{ fontFamily: "monospace" }}>
                {order._id}
              </span>
            </p>

            <p><b>Status:</b> {order.status}</p>
            <p><b>Total:</b> ₹{order.total}</p>
            <p><b>Payment:</b> Cash on Delivery</p>
            <p><b>Delivery Address:</b> {order.address}</p>
          </div>
        </div>
      )}

    </div>
  );
}
