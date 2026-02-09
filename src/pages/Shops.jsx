import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../services/axios";
import "../App.css";

export default function Shops() {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const initialPincode = params.get("pincode") || "";

  const [pincode, setPincode] = useState(initialPincode);
  const [groupedShops, setGroupedShops] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);

        if (pincode) {
          const res = await axios.get(`/shop/list/${pincode}`);
          setGroupedShops({
            [pincode]: Array.isArray(res.data) ? res.data : [],
          });
        } else {
          const res = await axios.get("/shop/grouped-by-pincode");
          setGroupedShops(res.data || {});
        }
      } catch (err) {
        console.error(err);
        setGroupedShops({});
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [pincode]);

  const handleSearch = () => {
    navigate(`/shops?pincode=${pincode}`, { replace: true });
  };

  return (
    <div className="shops-page">
      <div className="shops-header">
        <h1>Shops Near You</h1>
        <p>Trusted local stores delivering fast</p>
      </div>

      <div className="shops-search">
        <input
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          placeholder="Enter pincode"
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {loading && <p className="shops-status">Loading shops...</p>}

      {!loading && Object.keys(groupedShops).length === 0 && (
        <p className="shops-status">No shops found</p>
      )}

      {Object.entries(groupedShops).map(([pc, shops]) => (
        <div key={pc} className="shops-pincode-group">
          <h2 className="pincode-title">Pincode: {pc}</h2>

          <div className="shops-grid-horizontal">
            {shops.map((shop) => (
              <div className="shop-card" key={shop._id}>
                <img
                  className="shop-img"
                  src={
                    shop.image
                      ? `${import.meta.env.VITE_BACKEND_URL}/uploads/${shop.image}`
                      : "/images/shop-placeholder.png"
                  }
                  alt={shop.name}
                />

                <div className="shop-card-body">
                  <h3>{shop.name}</h3>
                  <p className="shop-area">
                    {shop.area} • {shop.pincode}
                  </p>
                  <button
                    className="shop-btn"
                    onClick={() =>
                      navigate(`/shop/${shop._id}`, { state: shop })
                    }
                  >
                    View Shop →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
