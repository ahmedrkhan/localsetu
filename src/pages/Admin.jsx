import { useEffect, useState } from "react";
import axios from "../services/axios";

export default function Admin() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  // frontend route guard
  if (!token || role !== "admin") return <p>Access Denied</p>;

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await axios.get("/admin/shops", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setShops(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [token]);

  if (loading) return <p>Loading admin dashboard...</p>;

  return (
    <div>
      <h1>Admin Panel</h1>
      <h2>All Shops</h2>
      {shops.length === 0 ? (
        <p>No shops found</p>
      ) : (
        <ul>
          {shops.map((shop) => (
            <li key={shop._id}>
              {shop.name} — Owner: {shop.owner.name} ({shop.owner.email})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
