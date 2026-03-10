import React, { useEffect, useState } from 'react';
import { UserData } from '../context/UserContext.jsx';
import { VegetableData } from '../context/VegetableContext.jsx';
import { Loading } from '../components/Loading.jsx';
import { FaUser, FaEnvelope, FaUserTag, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaLeaf, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, loading, updateUser } = UserData();
  const { userVegetables, fetchUserVegetables, deleteVegetable } = VegetableData();
  const navigate = useNavigate();
  const [profileLoading, setProfileLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: ''
  });

  useEffect(() => {
    // Wait for user data to load
    if (!loading) {
      setProfileLoading(false);
    }
    // Set initial form data when user loads
    if (user?.data?.user) {
      setFormData({
        name: user.data.user.name || '',
        address: user.data.user.address || ''
      });
      // Fetch user's vegetables if they're a farmer
      if (user.data.user.role === 'farmer') {
        fetchUserVegetables();
      }
    }
  }, [loading, user]);

  if (profileLoading || loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loading />
      </main>
    );
  }

  const userData = user?.data?.user;

  if (!userData) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 text-lg">No profile data available</p>
        </div>
      </main>
    );
  }

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'farmer':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'customer':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'delivery_boy':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const formatRole = (role) => {
    if (role === 'delivery_boy') return 'Delivery Boy';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
    setFormData({
      name: userData.name || '',
      address: userData.address || ''
    });
  };

  const handleSave = async () => {
    const success = await updateUser(formData.name, formData.address);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleDeleteVegetable = async (id) => {
    if (window.confirm('Are you sure you want to delete this vegetable?')) {
      const success = await deleteVegetable(id);
      if (success) {
        fetchUserVegetables(); // Refresh the list after deletion
      }
    }
  };

  return (
    <main className="bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-2">View and manage your account information</p>
          </div>
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
            >
              <FaEdit className="w-4 h-4" />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <FaTimes className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
              >
                <FaSave className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-12 text-white">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-green-600">
                <FaUser className="w-12 h-12" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">{formData.name}</h2>
                <p className="text-green-100 mt-1">{userData.email}</p>
                <div className="mt-3">
                  <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold border ${getRoleBadgeColor(userData.role)} bg-white`}>
                    {formatRole(userData.role)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Account Details</h3>
            
            <div className="space-y-6">
              {/* Name */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FaUser className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-medium">Full Name</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter your name"
                    />
                  ) : (
                    <p className="text-lg text-gray-900 mt-1">{userData.name}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FaEnvelope className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-medium">Email Address</p>
                  <p className="text-lg text-gray-900 mt-1">{userData.email}</p>
                </div>
              </div>

              {/* Role */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FaUserTag className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-medium">Account Type</p>
                  <p className="text-lg text-gray-900 mt-1">{formatRole(userData.role)}</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <FaMapMarkerAlt className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-medium">Address</p>
                  {isEditing ? (
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows="3"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter your address"
                    />
                  ) : (
                    <p className="text-lg text-gray-900 mt-1">{userData.address || 'Not provided'}</p>
                  )}
                </div>
              </div>

              {/* User ID */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <FaUser className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-medium">User ID</p>
                  <p className="text-sm text-gray-600 mt-1 font-mono">{userData._id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info based on role */}
        {userData.role === 'delivery_boy' && userData.assignedOrders !== undefined && (
          <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Statistics</h3>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-yellow-100 rounded-lg">
                <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Assigned Orders</p>
                <p className="text-2xl font-bold text-gray-900">{userData.assignedOrders}</p>
              </div>
            </div>
          </div>
        )}

        {/* My Vegetables - For Farmers */}
        {userData.role === 'farmer' && (
          <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FaLeaf className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">My Vegetables</h3>
                  <p className="text-sm text-gray-600">Vegetables you've added to the marketplace</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/vegetables')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                Add New
              </button>
            </div>

            {userVegetables && userVegetables.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userVegetables.map((veg, index) => (
                  <div key={veg._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-400">#{index + 1}</span>
                        <h4 className="text-lg font-semibold text-gray-900">{veg.title}</h4>
                      </div>
                      <button
                        onClick={() => handleDeleteVegetable(veg._id)}
                        className="text-red-600 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                        title="Delete vegetable"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                    {veg.image?.url && (
                      <img
                        src={veg.image.url}
                        alt={veg.title}
                        className="w-full h-32 object-cover rounded-md mb-3"
                      />
                    )}
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 line-clamp-2">{veg.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-green-600">₹{veg.price}</span>
                        <span className="text-sm text-gray-500">Qty: {veg.quantity}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                          {veg.category}
                        </span>
                        {veg.location && (
                          <span className="text-xs text-gray-500">📍 {veg.location}</span>
                        )}
                      </div>
                      <button
                        onClick={() => navigate(`/vegetables/${veg._id}`)}
                        className="w-full mt-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaLeaf className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">You haven't added any vegetables yet</p>
                <button
                  onClick={() => navigate('/add-vegetable')}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Add Your First Vegetable
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default Profile;
