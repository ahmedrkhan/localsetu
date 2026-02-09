import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import axios from "../services/axios";

export default function Register() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [category, setCategory] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (!category) return setError("Please select Customer or Shop Owner");
        if (password !== confirmPassword) return setError("Passwords do not match");

        setLoading(true);
        try {
            const res = await axios.post("/auth/register", {
                name,
                email,
                password,
                role: category
            });


            login(res.data.token, res.data.user);
            if (res.data.user.role === "shopowner") {
                navigate("/shop/setup");
            } else {
                navigate("/shops");
            }
        } catch (err) {
            console.log(err.response?.data)
            console.log(err.response?.data); // see exact backend error
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page-container">
            <form className="register-card-unique" onSubmit={handleRegister}>
                <h2>Create Account</h2>

                <div className="role-selector">
                    <button
                        type="button"
                        className={category === "customer" ? "role-btn active" : "role-btn"}
                        onClick={() => setCategory("customer")}
                    >
                        Customer
                    </button>
                    <button
                        type="button"
                        className={category === "shopowner" ? "role-btn active" : "role-btn"}
                        onClick={() => setCategory("shopowner")}
                    >
                        Shop Owner
                    </button>
                </div>

                {error && <p className="error">{error}</p>}

                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
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
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Signing Up..." : "Sign Up"}
                </button>

                <p className="signup-text">
                    Already have an account? <a href="/login">Sign In</a>
                </p>
            </form>
        </div>
    );
}
