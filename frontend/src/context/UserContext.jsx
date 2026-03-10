import { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  async function registerUser(name, email, password, role, address, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post("/api/user/register", {
        name,
        email,
        password,
        role,
        address
      });

      toast.success(data.message);
      setUser(data);
      setIsAuth(true);
      setBtnLoading(false);
      navigate("/");
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message 
        || error.response?.data?.message 
        || "Error during registration";
      toast.error(errorMessage);
      setBtnLoading(false);
    }
  }

  async function loginUser(email, password, role, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post("/api/user/login", { email, password, role });

      toast.success(data.message);
      setUser(data);
      setIsAuth(true);
      setBtnLoading(false);
      navigate("/");
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message 
        || error.response?.data?.message 
        || "Error during login";
      toast.error(errorMessage);
      setBtnLoading(false);
    }
  }

  async function logoutUser(navigate) {
    try {
      const { data } = await axios.post("/api/user/logout");
      
      toast.success(data.message);
      setUser([]);
      setIsAuth(false);
      navigate("/login");
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message 
        || error.response?.data?.message 
        || "Error during logout";
      toast.error(errorMessage);
    }
  }

  async function updateUser(name, address) {
    try {
      const { data } = await axios.put("/api/user/update", { name, address });
      
      toast.success(data.message);
      setUser(data);
      await fetchUser(); // Refresh user data
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message 
        || error.response?.data?.message 
        || "Error updating profile";
      toast.error(errorMessage);
      return false;
    }
  }

  async function forgotPassword(email, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post("/api/user/forgot-password", { email });
      
      toast.success(data.message);
      setBtnLoading(false);
      navigate("/reset-password", { state: { email } });
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message 
        || error.response?.data?.message 
        || "Error sending OTP";
      toast.error(errorMessage);
      setBtnLoading(false);
    }
  }

  async function resetPassword(email, otp, newPassword, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post("/api/user/reset-password", { 
        email, 
        otp, 
        newPassword 
      });
      
      toast.success(data.message);
      setBtnLoading(false);
      navigate("/login");
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message 
        || error.response?.data?.message 
        || "Error resetting password";
      toast.error(errorMessage);
      setBtnLoading(false);
    }
  }

  const [loading, setLoading] = useState(true);

  async function fetchUser() {
    try {
      const { data } = await axios.get("/api/user/me");

      setUser(data);
      setIsAuth(true);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        registerUser,
        loginUser,
        logoutUser,
        updateUser,
        forgotPassword,
        resetPassword,
        btnLoading,
        isAuth,
        user,
        loading
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);