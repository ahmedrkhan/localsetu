import { useEffect, useState, useContext } from "react";
import axios from "../services/axios";
import { AuthContext } from "../components/AuthContext";
import { io } from "socket.io-client";
import "../App.css";

const socket = io("http://localhost:5000");

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [shopId, setShopId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");

  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");

  // Fetch owner shop and orders
  useEffect(() => {
    const fetchShopAndOrders = async () => {
      try {
        const shopRes = await axios.get("/shop/my-shop", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setShopId(shopRes.data._id);

        const ordersRes = await axios.get(`/orders/shop/${shopRes.data._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(ordersRes.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load shop or orders");
      } finally {
        setLoading(false);
      }
    };
    fetchShopAndOrders();
  }, [token]);

  // Real-time new orders
  useEffect(() => {
    if (!shopId) return;
    socket.emit("join-shop", shopId);

    const handleNewOrder = (order) => {
      setNotification(`New order received: ${order._id}`);
      setOrders((prev) => [order, ...prev]);
      setTimeout(() => setNotification(""), 5000);
    };

    socket.on("new-order", handleNewOrder);
    return () => socket.off("new-order", handleNewOrder);
  }, [shopId]);

  // Update order status
  const updateStatus = async (orderId, status) => {
    try {
      const res = await axios.put(
        `/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: res.data.status } : o))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === "ALL" || order.status === filterStatus;
    const matchesSearch =
      order._id.includes(searchTerm) ||
      (order.userName && order.userName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  if (loading)
    return <p className="text-center mt-10 text-gray-400">Loading dashboard...</p>;

  // Function to map order status to CSS class
  const statusClass = (status) => {
    if (status === "CONFIRMED") return "status-confirmed";
    if (status === "OUT_FOR_DELIVERY") return "status-out";
    if (status === "DELIVERED") return "status-delivered";
    return "status-pending";
  };

  return (
    <div className="max-w-5xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-4 text-white">Owner Dashboard</h1>

      {notification && <div className="notification">{notification}</div>}

      {/* Filter Bar */}
      <div className="sticky top-0 bg-gray-900 p-4 mb-4 shadow z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-2 rounded-lg">
        <div className="flex gap-2 items-center">
          <label className="text-gray-300 font-medium">Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border p-2 rounded bg-gray-800 text-white"
          >
            <option value="ALL">All</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
            <option value="DELIVERED">Delivered</option>
          </select>
        </div>

        <div className="flex gap-2 items-center">
          <label className="text-gray-300 font-medium">Search:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Order ID or Customer"
            className="border p-2 rounded w-64 bg-gray-800 text-white"
          />
        </div>
      </div>

      {/* Orders */}
      {filteredOrders.length === 0 && (
        <p className="text-gray-400 text-center">No orders found</p>
      )}

      {filteredOrders.map((order) => {
        const totalItems = order.items.reduce((sum, i) => sum + i.qty, 0);
        return (
          <div key={order._id} className={`order-card ${statusClass(order.status)}`}>
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-200 font-medium"><b>Order ID:</b> {order._id}</p>
              <span className={`status-badge ${statusClass(order.status)}`}>{order.status}</span>
            </div>

            <p className="text-gray-300"><b>Ordered At:</b> {new Date(order.createdAt).toLocaleString()}</p>
            <p className="text-gray-300"><b>Customer:</b> {order.userName || "Guest"}</p>
            {order.userEmail && <p className="text-gray-300"><b>Email:</b> {order.userEmail}</p>}
            <p className="text-gray-300"><b>Phone:</b> {order.phone}</p>
            <p className="text-gray-300"><b>Address:</b> {order.address}</p>
            <p className="text-gray-300"><b>Payment Method:</b> {order.paymentType || "Cash on Delivery"}</p>
            <p className="text-gray-300"><b>Total Items:</b> {totalItems}</p>
            {order.notes && <p className="text-gray-300"><b>Notes:</b> {order.notes}</p>}


            <div className="mt-3">
              <b className="text-gray-200">Items:</b>
              <ul className="ml-5 mt-1 list-disc text-gray-400">
                {order.items.map((item) => (
                  <li key={item._id}>
                    {item.name} × {item.qty} = ₹{item.price * item.qty}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-gray-200 font-bold mt-2">Total: ₹{order.total}</p>

            <div className="flex gap-2 mt-4">
              <button onClick={() => updateStatus(order._id, "CONFIRMED")}>Confirm</button>
              <button onClick={() => updateStatus(order._id, "OUT_FOR_DELIVERY")}>Out for Delivery</button>
              <button onClick={() => updateStatus(order._id, "DELIVERED")}>Delivered</button>
            </div>
          </div>
        );
      })}

    </div>
  );
}
