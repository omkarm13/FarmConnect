import { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const VegetableContext = createContext();


export const VegetableProvider = ({children}) => {
    const [vegetables, setVegetables] = useState([]);
    const [userVegetables, setUserVegetables] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    async function fetchVegetables(search = "") {
        setLoading(true);
        try{
            const url = search ? `/api/vegetables?search=${encodeURIComponent(search)}` : "/api/vegetables";
            const {data} = await axios.get(url);
            setVegetables(data.data.vegetables);
            setSearchQuery(search);
            setLoading(false);
        }catch(error){
            console.error("Error fetching vegetables:", error);
            setLoading(false);
        }
    }

    async function searchVegetables(query) {
        await fetchVegetables(query);
    }

    async function clearSearch() {
        await fetchVegetables("");
    }

    const [vegetable, setVegetable] = useState([]);

     async function fetchVegetable(id) {
        setLoading(true);
        try{
            const { data } = await axios.get("/api/vegetables/"+id);
            setVegetable(data.data.vegetable);
            setLoading(false);
        }catch (error) {
            console.error("Error fetching vegetables:", error);
            setLoading(false);
        }
     }

     async function updateVegetable(id, formData, setEdit) {
        try{
            const { data } = await axios.put("/api/vegetables/"+id, formData);
            toast.success(data.message || "Vegetable updated successfully");
            fetchVegetable(id);
            setEdit(false);
        }
        catch(error){
            toast.error(error.response.data.message || "Error updating vegetable");
        }
     }

     async function createVegetable(formData) {
        try {
            const { data } = await axios.post("/api/vegetables", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success(data.message || "Vegetable added successfully");
            fetchVegetables(); // Refresh the vegetables list
            return true;
        } catch (error) {
            console.error("Error creating vegetable:", error);
            const errorMessage = error.response?.data?.error?.message 
                || error.response?.data?.message 
                || "Error adding vegetable";
            toast.error(errorMessage);
            return false;
        }
     }

     async function createReview(id, reviewData) {
        try {
            const { data } = await axios.post(`/api/vegetables/${id}/reviews`, { review: reviewData });
            toast.success(data.message || "Review added successfully");
            fetchVegetable(id);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error adding review");
        }
     }

     async function deleteReview(vegetableId, reviewId) {
        try {
            const { data } = await axios.delete(`/api/vegetables/${vegetableId}/reviews/${reviewId}`);
            toast.success(data.message || "Review deleted successfully");
            fetchVegetable(vegetableId);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error deleting review");
        }
     }

     async function deleteVegetable(id, navigate) {
        try {
            const { data } = await axios.delete(`/api/vegetables/${id}`);
            toast.success(data.message || "Vegetable deleted successfully");
            fetchVegetables(); // Refresh the vegetables list
            if (navigate) {
                navigate('/');
            }
            return true;
        } catch (error) {
            const errorMessage = error.response?.data?.error?.message 
                || error.response?.data?.message 
                || "Error deleting vegetable";
            toast.error(errorMessage);
            return false;
        }
     }

     async function fetchUserVegetables() {
        setLoading(true);
        try {
            const { data } = await axios.get("/api/user/vegetables");
            setUserVegetables(data.data.vegetables);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching user vegetables:", error);
            setUserVegetables([]);
            setLoading(false);
        }
     }


    useEffect(() => {
        fetchVegetables();
    }, []);

    return <VegetableContext.Provider value={{vegetables, loading, fetchVegetable, vegetable, updateVegetable, createVegetable, createReview, deleteReview, deleteVegetable, searchVegetables, clearSearch, searchQuery, userVegetables, fetchUserVegetables}}>
        {children}
    </VegetableContext.Provider>
};

export const VegetableData = () => useContext(VegetableContext);