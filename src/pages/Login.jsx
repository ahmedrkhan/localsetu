import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import axios from "../services/axios";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/auth/login", { email, password });
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      login(token, user);

      if (user.role === "shopowner") {
        try {
          await axios.get("/shop/my-shop", {
            headers: { Authorization: `Bearer ${token}` },
          });
          navigate("/my-shop");
        } catch (err) {
          if (err.response?.status === 404) navigate("/shop/setup");
          else throw err;
        }
      } else if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/shops");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleLogin}>
        <h2>Sign In</h2>
        {error && <p className="error">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>
        <p className="signup-text">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
