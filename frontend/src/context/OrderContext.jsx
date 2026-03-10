import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "../config/axios";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchOrders() {
        setLoading(true);
        try {
            const { data } = await axios.get("/api/order");
            setOrders(data.data.orders);
        } catch (error) {
            if (error.response?.status === 401) {
                setOrders([]);
            } else {
                console.error("Error fetching orders:", error);
            }
        } finally {
            setLoading(false);
        }
    }

    async function placeOrder() {
        try {
            const { data } = await axios.post("/api/order");
            toast.success(data.message || "Order placed successfully");
            fetchOrders();
            return { success: true, order: data.data.order };
        } catch (error) {
            toast.error(error.response?.data?.error?.message || "Error placing order");
            return { success: false };
        }
    }

    async function cancelOrder(orderId) {
        try {
            const { data } = await axios.delete(`/api/order/${orderId}`);
            toast.success(data.message || "Order cancelled successfully");
            fetchOrders();
        } catch (error) {
            toast.error(error.response?.data?.error?.message || "Error cancelling order");
        }
    }

    async function getOrderById(orderId) {
        try {
            const { data } = await axios.get(`/api/order/${orderId}`);
            return data.data.order;
        } catch (error) {
            toast.error(error.response?.data?.error?.message || "Error fetching order");
            return null;
        }
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <OrderContext.Provider value={{ orders, loading, fetchOrders, placeOrder, cancelOrder, getOrderById }}>
            {children}
        </OrderContext.Provider>
    );
};

export const OrderData = () => useContext(OrderContext);
