import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminData } from '../context/AdminContext.jsx';
import { Loading } from '../components/Loading.jsx';
import { FaBox, FaTruck, FaSignOutAlt, FaSync } from 'react-icons/fa';

const AdminDashboard = () => {
  const { orders, deliveryBoys, ordersLoading, fetchOrders, assignOrder, adminLogout } = AdminData();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleLogout = () => {
    adminLogout(navigate);
  };

  const handleAssignOrder = (orderId) => {
    if (window.confirm('Reassign this order to a delivery boy?')) {
      assignOrder(orderId);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Assigned':
        return 'bg-blue-100 text-blue-700';
      case 'Delivered':
        return 'bg-green-100 text-green-700';
      case 'Cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (ordersLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loading />
      </main>
    );
  }

  return (
    <main className="bg-gray-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage orders and delivery assignments</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => fetchOrders()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              <FaSync className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors duration-200"
            >
              <FaSignOutAlt className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaBox className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FaTruck className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Delivery Boys</p>
                <p className="text-3xl font-bold text-gray-900">{deliveryBoys.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FaBox className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Pending Orders</p>
                <p className="text-3xl font-bold text-gray-900">
                  {orders.filter(o => o.status !== 'Delivered').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Boys Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Delivery Boys</h2>
          {deliveryBoys.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deliveryBoys.map((boy) => (
                <div key={boy._id} className="p-4 border border-gray-200 rounded-lg">
                  <p className="font-semibold text-gray-900">{boy.name}</p>
                  <p className="text-sm text-gray-600">{boy.email}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Assigned Orders: <span className="font-semibold">{boy.assignedOrders || 0}</span>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No delivery boys available</p>
          )}
        </div>

        {/* Orders Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">All Orders</h2>
          {!orders || orders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
              <FaBox className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg">No orders found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Order ID</p>
                        <p className="font-semibold text-gray-900">{order._id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Customer</p>
                        <p className="font-semibold text-gray-900">{order.user?.name || 'N/A'}</p>
                        <p className="text-xs text-gray-600">{order.user?.email || ''}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Order Date</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="text-xl font-bold text-green-700">₹{order.totalPrice?.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                      <div>
                        {order.assignedTo ? (
                          <>
                            <p className="text-sm text-gray-600">
                              Delivery Boy: <span className="font-semibold text-gray-900">{order.assignedTo.name}</span>
                            </p>
                            <p className="text-xs text-gray-500">{order.assignedTo.email}</p>
                          </>
                        ) : (
                          <p className="text-sm text-gray-600">Not assigned yet</p>
                        )}
                      </div>
                      {order.status !== 'Delivered' && (
                        <button
                          onClick={() => handleAssignOrder(order._id)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors duration-200"
                        >
                          <FaTruck className="w-4 h-4" />
                          {order.assignedTo ? 'Reassign' : 'Assign'}
                        </button>
                      )}
                    </div>

                    {/* Customer Address */}
                    {order.user?.address && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                          Delivery Address: <span className="text-gray-900">{order.user.address}</span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                    <div className="space-y-3">
                      {order.items?.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg"
                        >
                          {item.vegetable?.image?.url && (
                            <img
                              src={item.vegetable.image.url}
                              alt={item.vegetable.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{item.vegetable?.title || 'N/A'}</p>
                            <p className="text-sm text-gray-600">
                              ₹{item.vegetable?.price || 0} / kg × {item.quantity} kg
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              ₹{((item.vegetable?.price || 0) * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
