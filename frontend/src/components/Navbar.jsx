import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSeedling, FaSearch, FaShoppingCart, FaBox, FaTruck } from 'react-icons/fa';
import { CartData } from '../context/CartContext.jsx';
import { UserData } from '../context/UserContext.jsx';
import { VegetableData } from '../context/VegetableContext.jsx';


const Navbar = ({ user }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { cart } = CartData();
  const { logoutUser } = UserData();
  const { searchVegetables } = VegetableData();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logoutUser(navigate);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      searchVegetables(searchInput.trim());
      navigate('/');
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  return (
    <header className="bg-white text-gray-800 shadow-md sticky top-0 z-50">
      <div className="mx-auto px-6 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center" style={{ textDecoration: 'none' }}>
            <FaSeedling className="h-8 w-8 mr-2 text-green-600" />
            <span className="text-2xl font-bold tracking-tight text-green-600">
              FarmConnect
            </span>
          </Link>
        </div>

        <div className="flex-1 flex justify-center px-4">
          <form onSubmit={handleSearch} className="flex w-full max-w-lg items-stretch">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Search for vegetables..."
                value={searchInput}
                onChange={handleSearchInputChange}
                className="search-input w-full h-full pl-10 pr-4 py-2 border border-r-0 text-gray-700 focus:outline-none focus:border-green-500"
              />
            </div>
            <button 
              type="submit"
              className="search-button bg-green-600 hover:bg-green-700 text-white px-6 h-full transition-colors duration-300 flex items-center justify-center"
            >
              <FaSearch className="h-5 w-5" />
            </button>
          </form>
        </div>

        <nav className="flex items-center space-x-6">

          { user && !(<Link to="/" className="nav-link hover:text-green-800 transition-colors duration-300 font-medium" style={{ textDecoration: 'none' }}>Home</Link>)}

          { user && user.data && user.data.user && user.data.user.role === "farmer" && (<Link to="/vegetables" className="nav-link hover:text-green-800 transition-colors duration-300 font-medium" style={{ textDecoration: 'none' }}> + Add Veggies</Link>)}

          { user && user.data && user.data.user && user.data.user.role === "delivery_boy" && (
            <Link 
              to="/delivery" 
              className="relative flex items-center gap-1"
              style={{ textDecoration: 'none' }}
            >
              <FaTruck className="h-6 w-6 text-gray-700 hover:text-green-600 transition-colors duration-300" />
              <span className="font-medium text-green-600 hover:text-green-700 transition-colors duration-300">My Deliveries</span>
            </Link>
          )}

          { user && user.data && user.data.user && user.data.user.role === "customer" && (
            <>
              <Link to="/cart" className="relative flex items-center gap-1" style={{ textDecoration: 'none' }}>
                <div className="relative">
                  <FaShoppingCart className="h-6 w-6 text-gray-700 hover:text-green-600 transition-colors duration-300" />
                  {cart?.items && cart.items.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cart.items.length}
                    </span>
                  )}
                </div>
                <span className="font-medium text-green-600 hover:text-green-700 transition-colors duration-300">My Cart</span>
              </Link>
              <Link to="/orders" className="relative flex items-center gap-1" style={{ textDecoration: 'none' }}>
                <FaBox className="h-6 w-6 text-gray-700 hover:text-green-600 transition-colors duration-300" />
                <span className="font-medium text-green-600 hover:text-green-700 transition-colors duration-300">Orders</span>
              </Link>
            </>
          )}

          { user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 bg-gray-200 flex items-center justify-center font-bold text-lg hover:bg-gray-300 transition-colors duration-300 focus:outline-none"
                style={{ borderRadius: '50%' }}
              >
                {user.data && user.data.user && user.data.user.name ? user.data.user.name.slice(0, 1) : 'U'}
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200 no-underline"
                    style={{ textDecoration: 'none' }}
                    onClick={() => setDropdownOpen(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition-colors duration-200 font-medium"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          { !user && (<Link to="/register" className="nav-link hover:text-green-800 transition-colors duration-300 font-medium" style={{ textDecoration: 'none' }}>Register</Link>)}
          { !user && (<Link to="/login" className="nav-link hover:text-green-800 transition-colors duration-300 font-medium" style={{ textDecoration: 'none' }}>Login</Link>)}
          
        </nav>
      </div>
    </header>
  );
};

export default Navbar;