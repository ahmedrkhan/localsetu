import { useState, useEffect, useContext } from "react";
import axios from "../services/axios";
import { socket } from "../services/socket";
import { AuthContext } from "../components/AuthContext";
import "../App.css"; // separate CSS for styling

export default function TrackOrder() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(null);

  // Fetch current user's orders
  useEffect(() => {
    async function fetchOrders() {
      if (!user) return setOrders([]); // clear on logout
      try {
        const res = await axios.get("/orders/my");
        setOrders(res.data || []);
      } catch (err) {
        console.error(err);
        setOrders([]);
      }
    }
    fetchOrders();
  }, [user]);

  // Live updates via socket
  useEffect(() => {
    socket.on("order-updated", (updatedOrder) => {
      setOrders((prev) =>
        prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
      );
    });
    return () => socket.off("order-updated");
  }, []);

  const statusColors = {
    CONFIRMED: "#3B82F6",
    OUT_FOR_DELIVERY: "#F59E0B",
    DELIVERED: "#10B981",
    CANCELLED: "#EF4444",
  };

  return (
    <div className="track-container">
      <h2>Your Orders</h2>

      {orders.length === 0 && <p className="track-empty">No orders yet.</p>}

      {orders.slice(0, expanded ? orders.length : 3).map((order) => (
        <div key={order._id} className="track-card">
          <div className="track-header">
            <span
              className="track-status"
              style={{ backgroundColor: statusColors[order.status] || "gray" }}
            >
              {order.status}
            </span>
            <span className="track-total">₹{order.total}</span>
            <span className="track-date">
              {new Date(order.createdAt).toLocaleDateString()}
            </span>
          </div>

          <ul className="track-items">
            {order.items.map((item) => (
              <li key={item._id}>
                <span>{item.name} × {item.qty}</span>
                <span>₹{item.price * item.qty}</span>
              </li>
            ))}
          </ul>

          {expanded === order._id && (
            <div className="track-details">
              <p><b>Customer:</b> {user?.name || "Guest"}</p>
              <p><b>Phone:</b> {order.phone}</p>
              <p><b>Address:</b> {order.address}</p>
              <p><b>Estimated Delivery:</b> {order.estimatedDelivery || "1-2 Hour"}</p>
            </div>
          )}

          <button
            className="track-toggle"
            onClick={() => setExpanded(expanded === order._id ? null : order._id)}
          >
            {expanded === order._id ? "View Less" : "View More"}
          </button>
        </div>
      ))}

      {orders.length > 3 && !expanded && (
        <button className="track-view-all" onClick={() => setExpanded(true)}>
          View All Orders
        </button>
      )}
    </div>
  );
}
