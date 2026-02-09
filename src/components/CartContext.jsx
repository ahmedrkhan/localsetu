import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useContext(AuthContext);

    // Load initial cart from localStorage
    const [cartItems, setCartItems] = useState(
        () => JSON.parse(localStorage.getItem("cart")) || []
    );

    const [popup, setPopup] = useState("");

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);

    // Clear cart on logout
    useEffect(() => {
        if (!user) clearCart();
    }, [user]);

    const addToCart = (product, qty = 1) => {
        setCartItems((prev) => {
            const exists = prev.find((p) => p._id === product._id);
            if (exists) {
                return prev.map((p) =>
                    p._id === product._id ? { ...p, qty: p.qty + qty } : p
                );
            }
            return [...prev, { ...product, qty }];
        });

        setPopup(`${product.name} added to cart`);
        setTimeout(() => setPopup(""), 2000); // hide after 2s
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem("cart");
    };

    return (
        <CartContext.Provider value={{ cartItems, setCartItems, addToCart, clearCart, popup }}>
            {children}
        </CartContext.Provider>
    );
};

