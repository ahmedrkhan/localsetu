import { useEffect } from "react";
import axios from "../services/axios";
import { useNavigate } from "react-router-dom";

export default function ShopRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/shop/my-shop")
      .then(res => {
        if (res.data) navigate("/my-shop");
        else navigate("/shop/setup");
      })
      .catch(() => navigate("/shop/setup"));
  }, []);

  return null;
}
