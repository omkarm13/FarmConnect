import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const [isAdminAuth, setIsAdminAuth] = useState(false);
    const [adminLoading, setAdminLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [deliveryBoys, setDeliveryBoys] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);

    async function adminLogin(username, password, navigate) {
        setAdminLoading(true);
        try {
            const { data } = await axios.post("/api/admin/login", { username, password });
            toast.success(data.message || "Admin login successful");
            setIsAdminAuth(true);
            setAdminLoading(false);
            navigate("/admin/dashboard");
        } catch (error) {
            toast.error(error.response?.data?.error?.message || "Login failed");
            setAdminLoading(false);
        }
    }

    async function adminLogout(navigate) {
        try {
            const { data } = await axios.post("/api/admin/logout");
            toast.success(data.message || "Logged out successfully");
            setIsAdminAuth(false);
            navigate("/admin/login");
        } catch (error) {
            toast.error(error.response?.data?.error?.message || "Logout failed");
        }
    }

    async function fetchOrders() {
        setOrdersLoading(true);
        try {
            const { data } = await axios.get("/api/admin/orders");
            setOrders(data.data.orders);
            setDeliveryBoys(data.data.deliveryBoys);
        } catch (error) {
            if (error.response?.status === 401) {
                setIsAdminAuth(false);
                setOrders([]);
                setDeliveryBoys([]);
            } else {
                console.error("Error fetching orders:", error);
            }
        } finally {
            setOrdersLoading(false);
        }
    }

    async function assignOrder(orderId) {
        try {
            const { data } = await axios.patch(`/api/admin/orders/${orderId}/assign`);
            toast.success(data.message || "Order assigned successfully");
            fetchOrders();
        } catch (error) {
            toast.error(error.response?.data?.error?.message || "Error assigning order");
        }
    }

    return (
        <AdminContext.Provider value={{ 
            isAdminAuth, 
            adminLoading, 
            adminLogin, 
            adminLogout,
            orders,
            deliveryBoys,
            ordersLoading,
            fetchOrders,
            assignOrder
        }}>
            {children}
        </AdminContext.Provider>
    );
};

export const AdminData = () => useContext(AdminContext);
