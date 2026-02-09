import { useEffect, useState } from "react";
import {
  getAllUsers,
  blockUser,
  unblockUser,
  deleteUser,
} from "../../services/adminApi";
import AdminNavbar from "../../components/AdminNavbar";
import "../../App.css"
export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    const res = await getAllUsers();
    setUsers(res.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleBlockToggle = async (user) => {
    user.isBlocked ? await unblockUser(user._id) : await blockUser(user._id);
    loadUsers();
  };

  return (
    <div className="admin-layout">
      <AdminNavbar />
      <div className="admin-content">
        <h2>Users</h2>
        <table className="admin-users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Blocked</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.isBlocked ? "Yes" : "No"}</td>
                <td>
                  <button
                    className={u.isBlocked ? "unblock-btn" : "block-btn"}
                    onClick={() => handleBlockToggle(u)}
                  >
                    {u.isBlocked ? "Unblock" : "Block"}
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteUser(u._id).then(loadUsers)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
