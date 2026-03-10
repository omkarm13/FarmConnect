import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ items: [] });
    const [loading, setLoading] = useState(true);

    async function fetchCart() {
        setLoading(true);
        try {
            const { data } = await axios.get("/api/cart");
            setCart(data.data.cart);
        } catch (error) {
            if (error.response?.status === 401) {
                setCart({ items: [] });
            } else {
                console.error("Error fetching cart:", error);
            }
        } finally {
            setLoading(false);
        }
    }

    async function addToCart(vegId, quantity = 1) {
        try {
            const { data } = await axios.post(`/api/cart/${vegId}`, { quantity });
            toast.success(data.message || "Item added to cart");
            fetchCart();
        } catch (error) {
            toast.error(error.response?.data?.error?.message || "Error adding to cart");
        }
    }

    async function updateCartItem(vegId, quantity) {
        try {
            const { data } = await axios.put(`/api/cart/${vegId}`, { quantity });
            toast.success(data.message || "Cart updated");
            fetchCart();
        } catch (error) {
            toast.error(error.response?.data?.error?.message || "Error updating cart");
        }
    }

    async function removeFromCart(vegId) {
        try {
            const { data } = await axios.delete(`/api/cart/${vegId}`);
            toast.success(data.message || "Item removed from cart");
            fetchCart();
        } catch (error) {
            toast.error(error.response?.data?.error?.message || "Error removing from cart");
        }
    }

    useEffect(() => {
        fetchCart();
    }, []);

    return (
        <CartContext.Provider value={{ cart, loading, fetchCart, addToCart, updateCartItem, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const CartData = () => useContext(CartContext);
