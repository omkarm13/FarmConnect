import React from 'react';
import { Link } from 'react-router-dom';
import { OrderData } from '../context/OrderContext.jsx';
import { Loading } from '../components/Loading.jsx';
import { FaBox, FaTrash } from 'react-icons/fa';

const Orders = () => {
  const { orders, loading, cancelOrder } = OrderData();

  const handleCancelOrder = (orderId, status) => {
    if (status === 'Delivered') {
      return;
    }
    if (window.confirm('Are you sure you want to cancel this order?')) {
      cancelOrder(orderId);
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

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loading />
      </main>
    );
  }

  return (
    <main className="bg-gray-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-10">My Orders</h1>

        {!orders || orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <FaBox className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg mb-4">You haven't placed any orders yet</p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-200"
            >
              Start Shopping
            </Link>
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
                      <p className="text-sm text-gray-500">Order Date</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
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
                      <p className="text-xl font-bold text-green-700">₹{order.totalPrice.toFixed(2)}</p>
                    </div>
                  </div>
                  {order.assignedTo && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        Delivery Boy: <span className="font-semibold text-gray-900">{order.assignedTo.name}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {order.items.map((item, index) => {
                      if (!item.vegetable) {
                        return (
                          <div
                            key={index}
                            className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg bg-gray-50"
                          >
                            <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-gray-400 text-xs">Deleted</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-lg font-semibold text-gray-500">Product no longer available</p>
                              <p className="text-gray-500 mt-1">
                                Quantity: <span className="font-semibold">{item.quantity} kg</span>
                              </p>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg"
                        >
                          <Link to={`/vegetables/${item.vegetable._id}`}>
                            {item.vegetable.image?.url ? (
                              <img
                                src={item.vegetable.image.url}
                                alt={item.vegetable.title}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                                <span className="text-gray-400 text-xs">No image</span>
                              </div>
                            )}
                          </Link>

                          <div className="flex-1">
                            <Link
                              to={`/vegetables/${item.vegetable._id}`}
                              className="text-lg font-semibold text-gray-900 hover:text-green-600 transition-colors"
                            >
                              {item.vegetable.title}
                            </Link>
                            <p className="text-gray-600 mt-1">
                              ₹{item.vegetable.price} / kg
                            </p>
                            <p className="text-gray-600 mt-1">
                              Quantity: <span className="font-semibold">{item.quantity} kg</span>
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-xl font-semibold text-gray-900">
                              ₹{(item.vegetable.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Cancel Order Button */}
                  {/* {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => handleCancelOrder(order._id, order.status)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors duration-200"
                      >
                        <FaTrash className="w-4 h-4" />
                        Cancel Order
                      </button>
                    </div>
                  )} */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Orders;
