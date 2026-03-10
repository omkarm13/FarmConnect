import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Cart from './pages/Cart.jsx';
import Orders from './pages/Orders.jsx';
import Profile from './pages/Profile.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import DeliveryDashboard from './pages/DeliveryDashboard.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import {UserData} from "./context/UserContext.jsx";
import {CartProvider} from "./context/CartContext.jsx";
import {OrderProvider} from "./context/OrderContext.jsx";
import {AdminProvider} from "./context/AdminContext.jsx";
import {DeliveryProvider} from "./context/DeliveryContext.jsx";
import {ProtectedAdminRoute, AdminLoginRoute} from "./components/AdminRoutes.jsx";
import {Loading} from './components/Loading.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import VegetablePage from './pages/VegetablePage.jsx';
import AddVegetable from './pages/AddVegetable.jsx';

const App = () => {
  const {isAuth, loading, user} = UserData();
  return (
    <>
    {loading ? ( <Loading /> ) : ( 
      <BrowserRouter>
      <AdminProvider>
      <CartProvider>
      <OrderProvider>
      <div className="flex flex-col min-h-screen">
      {isAuth ? <Navbar user={user} /> : <Navbar />}
      <main className="flex-grow">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={isAuth ? <Home /> : <Login />} />
        <Route path="/register" element={isAuth ? <Home /> : <Register />} />
        <Route path="/forgot-password" element={isAuth ? <Home /> : <ForgotPassword />} />
        <Route path="/reset-password" element={isAuth ? <Home /> : <ResetPassword />} />
        <Route path="/cart" element={isAuth ? <Cart /> : <Login />} />
        <Route path="/orders" element={isAuth ? <Orders /> : <Login />} />
        <Route path="/profile" element={isAuth ? <Profile /> : <Login />} />
        <Route path="/vegetables" element={isAuth ? <AddVegetable /> : <Login />} />
        <Route path="/delivery" element={
          isAuth ? (
            <DeliveryProvider>
              <DeliveryDashboard />
            </DeliveryProvider>
          ) : <Login />
        } />
        <Route path="/vegetables/:id" element={isAuth ? <VegetablePage user={user} /> : <VegetablePage />}/>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginRoute><AdminLogin /></AdminLoginRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
      </Routes>
      </main>
      <Footer />
      </div>
      </OrderProvider>
      </CartProvider>
      </AdminProvider>
      </BrowserRouter>)
    }
    </>
  )
}

export default App