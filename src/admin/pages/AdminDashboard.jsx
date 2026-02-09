import { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import {
  getAllShops,
  getAllUsers,
  approveShop,
  blockShop,
  unblockShop,
  deleteShop,
} from "../../services/adminApi";

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalShops: 0,
    pendingShops: 0,
    blockedShops: 0,
  });
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const usersRes = await getAllUsers();
      const shopsRes = await getAllShops();

      setShops(shopsRes.data);

      setMetrics({
        totalUsers: usersRes.data.length,
        totalShops: shopsRes.data.length,
        pendingShops: shopsRes.data.filter(
          (s) => !s.isApproved && !s.isBlocked
        ).length,
        blockedShops: shopsRes.data.filter((s) => s.isBlocked).length,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to load dashboard metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  const handleApprove = async (shop) => {
    await approveShop(shop._id);
    loadMetrics();
  };

  const handleBlockToggle = async (shop) => {
    shop.isBlocked
      ? await unblockShop(shop._id)
      : await blockShop(shop._id);
    loadMetrics();
  };

  const handleDelete = async (shop) => {
    if (!window.confirm(`Delete shop "${shop.name}" permanently?`)) return;
    await deleteShop(shop._id);
    loadMetrics();
  };

  if (loading) return <p className="loading">Loading dashboard...</p>;

  return (
    <div className="admin-layout">
      <AdminNavbar />
      <div className="admin-content">
        <h2>Admin Dashboard</h2>

        {/* METRICS */}
        <div className="admin-metrics">
          <div className="metric-card users">
            <span>Total Users</span>
            <h2>{metrics.totalUsers}</h2>
          </div>
          <div className="metric-card shops">
            <span>Total Shops</span>
            <h2>{metrics.totalShops}</h2>
          </div>
          <div className="metric-card pending">
            <span>Pending Approval</span>
            <h2>{metrics.pendingShops}</h2>
          </div>
          <div className="metric-card blocked">
            <span>Blocked Shops</span>
            <h2>{metrics.blockedShops}</h2>
          </div>
        </div>

        {/* SHOPS TABLE */}
        <h3 className="shoph3">Shops Management</h3>
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Shop</th>
                <th>Owner</th>
                <th>Approval</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shops.map((shop) => (
                <tr key={shop._id}>
                  <td><strong>{shop.name}</strong></td>
                  <td>{shop.ownerName}</td>
                  <td>
                    <span className={`badge ${shop.isApproved ? "approved" : "pending"}`}>
                      {shop.isApproved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${shop.isBlocked ? "blocked" : "active"}`}>
                      {shop.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="actions">
                    {!shop.isApproved && (
                      <button className="admin-btn approve" onClick={() => handleApprove(shop)}>
                        Approve
                      </button>
                    )}
                    <button
                      className={`admin-btn ${shop.isBlocked ? "unblock" : "block"}`}
                      onClick={() => handleBlockToggle(shop)}
                    >
                      {shop.isBlocked ? "Unblock" : "Block"}
                    </button>
                    <button className="admin-btn delete" onClick={() => handleDelete(shop)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
