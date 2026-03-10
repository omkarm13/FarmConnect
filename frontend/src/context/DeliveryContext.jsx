import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "../config/axios";

const DeliveryContext = createContext();

export const DeliveryProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [customerLocations, setCustomerLocations] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchOrders() {
        setLoading(true);
        try {
            const { data } = await axios.get("/api/delivery/orders");
            setOrders(data.data.orders || []);
            setCustomerLocations(data.data.customerLocations || []);
        } catch (error) {
            console.error("Error fetching delivery orders:", error);
            setOrders([]);
            setCustomerLocations([]);
        } finally {
            setLoading(false);
        }
    }

    async function markAsDelivered(orderId) {
        try {
            const { data } = await axios.patch(`/api/delivery/orders/${orderId}/status`);
            toast.success(data.message || "Order marked as delivered");
            fetchOrders();
        } catch (error) {
            toast.error(error.response?.data?.error?.message || "Error updating order status");
        }
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <DeliveryContext.Provider value={{ orders, customerLocations, loading, fetchOrders, markAsDelivered }}>
            {children}
        </DeliveryContext.Provider>
    );
};

export const DeliveryData = () => {
    const context = useContext(DeliveryContext);
    if (!context) {
        throw new Error('DeliveryData must be used within a DeliveryProvider');
    }
    return context;
};
