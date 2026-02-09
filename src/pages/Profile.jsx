import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../components/AuthContext";
import axios from "../services/axios";
import "../App.css"; // separate CSS file

export default function Profile() {
    const fileRef = useRef(null);
    const { user, token, setUser } = useContext(AuthContext);

    const [editingProfile, setEditingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({ name: "", email: "" });
    const [shop, setShop] = useState({
        name: "",
        address: "",
        area: "",
        pincode: "",
        description: "",
        image: "",
    });
    const [shopExists, setShopExists] = useState(false);

    useEffect(() => {
        if (!user) return;
        setProfileForm({ name: user.name, email: user.email });

        if (user.role === "shopowner") {
            axios
                .get("/shop/my-shop", { headers: { Authorization: `Bearer ${token}` } })
                .then((res) => {
                    setShop(res.data);
                    setShopExists(true);
                })
                .catch(() => {
                    setShop({ name: "", address: "", area: "", pincode: "", description: "", image: "" });
                    setShopExists(false);
                });
        }
    }, [user, token]);

    const saveProfile = async () => {
        const res = await axios.put("/users/me", profileForm, { headers: { Authorization: `Bearer ${token}` } });
        setUser(res.data);
        setEditingProfile(false);
    };

    const saveShop = async () => {
        const fd = new FormData();
        fd.append("name", shop.name);
        fd.append("address", shop.address);
        fd.append("area", shop.area);
        fd.append("description", shop.description);
        fd.append("pincode", shop.pincode);
        if (fileRef.current?.files[0]) fd.append("image", fileRef.current.files[0]);

        if (shopExists) {
            await axios.put("/shop/my-shop", fd, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } });
            alert("Shop updated");
        } else {
            await axios.post("/shop/setup", fd, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } });
            alert("Shop created");
            setShopExists(true);
        }
    };

    if (!user) return <p className="profile-loading">Loading...</p>;

    return (
        <div className="profile-container">
            {/* Profile Section */}
            <section className="profile-section">
                <h2 className="profile-section-title">Profile</h2>

                {editingProfile ? (
                    <div className="profile-form">
                        <input className="profile-input" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} placeholder="Name"/>
                        <input className="profile-input" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} placeholder="Email"/>
                        <button className="profile-btn" onClick={saveProfile}>Save</button>
                        <button className="profile-btn profile-btn-cancel" onClick={() => setEditingProfile(false)}>Cancel</button>
                    </div>
                ) : (
                    <div className="profile-info">
                        <p className="profile-text"><b>Name:</b> {user.name}</p>
                        <p className="profile-text"><b>Email:</b> {user.email}</p>
                        <button className="profile-btn" onClick={() => setEditingProfile(true)}>Edit Profile</button>
                    </div>
                )}

                <p className="profile-role"><b>Role:</b> {user.role}</p>
            </section>

            {/* Shop Section */}
            {user.role === "shopowner" && (
                <section className="shop-section">
                    <h2 className="shop-section-title">{shopExists ? "Edit Shop" : "Create Shop"}</h2>

                    {shop.image && <img src={`http://localhost:5000/uploads/${shop.image}`} alt="shop" className="shop-image"/>}

                    <input type="text" className="shop-input" placeholder="Shop name" value={shop.name} onChange={(e) => setShop({ ...shop, name: e.target.value })}/>
                    <input type="text" className="shop-input" placeholder="Address" value={shop.address} onChange={(e) => setShop({ ...shop, address: e.target.value })}/>
                    <input type="text" className="shop-input" placeholder="Area" value={shop.area} onChange={(e) => setShop({ ...shop, area: e.target.value })}/>
                    <input type="text" className={`shop-input ${shop.pincode ? "shop-input-disabled" : ""}`} placeholder="Pincode" value={shop.pincode} onChange={(e) => setShop({ ...shop, pincode: e.target.value })} disabled={!!shop.pincode}/>
                    <textarea className="shop-textarea" placeholder="Description" value={shop.description} onChange={(e) => setShop({ ...shop, description: e.target.value })}></textarea>
                    <input type="file" className="shop-file" ref={fileRef} name="image"/>

                    <button className="shop-btn" onClick={saveShop}>{shopExists ? "Update Shop" : "Create Shop"}</button>
                </section>
            )}
        </div>
    );
}
