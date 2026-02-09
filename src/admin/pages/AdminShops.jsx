import { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";

import {
  getAllShops,
  approveShop,
  blockShop,
  unblockShop,
  deleteShop,
} from "../../services/adminApi";
import "../../App.css"

export default function AdminShops() {
  const [shops, setShops] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);

  const loadShops = async () => {
    setLoading(true);
    try {
      const res = await getAllShops();
      setShops(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load shops");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShops();
  }, []);

  const filteredShops = shops.filter((s) => {
    if (filter === "pending") return !s.isApproved && !s.isBlocked;
    if (filter === "approved") return s.isApproved && !s.isBlocked;
    if (filter === "blocked") return s.isBlocked;
    return true;
  });

  const handleBlockToggle = async (shop) => {
    const action = shop.isBlocked ? "Unblock" : "Block";
    if (!window.confirm(`${action} this shop?`)) return;

    try {
      shop.isBlocked
        ? await unblockShop(shop._id)
        : await blockShop(shop._id);

      loadShops();
    } catch (err) {
      console.error(err);
      alert("Action failed");
    }
  };

  if (loading) return <p className="loading">Loading shops…</p>;

  return (
    <div className="admin-shops-page">
      <AdminNavbar />
      <div className="admin-content">
        <h2>Shop Management</h2>

        {/* FILTERS */}
        <div className="shop-filters">
          {["pending", "approved", "blocked"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={filter === f ? "active" : ""}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        {filteredShops.length === 0 ? (
          <p>No shops found.</p>
        ) : (
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Shop</th>
                  <th>Owner</th>
                  <th>Pincode</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredShops.map((shop) => (
                  <tr key={shop._id}>
                    <td>{shop.name}</td>
                    <td>
                      {shop.owner?.name}
                      <br />
                      <small>{shop.owner?.email}</small>
                    </td>
                    <td>{shop.pincode}</td>
                    <td>
                      <span
                        className={`badge ${shop.isBlocked
                            ? "blocked"
                            : shop.isApproved
                              ? "approved"
                              : "pending"
                          }`}
                      >
                        {shop.isBlocked
                          ? "BLOCKED"
                          : shop.isApproved
                            ? "APPROVED"
                            : "PENDING"}
                      </span>
                    </td>
                    <td className="actions">
                      {!shop.isApproved && !shop.isBlocked && (
                        <button
                          className="admin-btn approve"
                          onClick={() =>
                            approveShop(shop._id).then(loadShops)
                          }
                        >
                          Approve
                        </button>
                      )}

                      <button
                        className={`admin-btn ${shop.isBlocked ? "unblock" : "block"
                          }`}
                        onClick={() => handleBlockToggle(shop)}
                      >
                        {shop.isBlocked ? "Unblock" : "Block"}
                      </button>

                      <button
                        className="admin-btn delete"
                        onClick={() => {
                          if (
                            window.confirm("Delete shop permanently?")
                          ) {
                            deleteShop(shop._id).then(loadShops);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
