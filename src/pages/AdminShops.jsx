import { useEffect, useState } from "react";
import axios from "../services/axios";

export default function AdminShops() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("Unauthorized");
      setLoading(false);
      return;
    }

    const fetchShops = async () => {
      try {
        const res = await axios.get("/admin/shops", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setShops(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load shops");
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [token]);

  const deleteShop = async (id) => {
    if (!window.confirm("Delete this shop?")) return;
    try {
      await axios.delete(`/admin/shops/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShops((prev) => prev.filter((s) => s._id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="admin-shops">
      <h2>All Shops</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Owner</th>
            <th>Pincode</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {shops.map((shop) => (
            <tr key={shop._id}>
              <td>{shop.name}</td>
              <td>{shop.ownerName}</td>
              <td>{shop.pincode}</td>
              <td>
                <button onClick={() => deleteShop(shop._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
