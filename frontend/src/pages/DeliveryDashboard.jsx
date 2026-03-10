import React, { useState, useEffect, useRef } from 'react';
import { DeliveryData } from '../context/DeliveryContext.jsx';
import { Loading } from '../components/Loading.jsx';
import { FaTruck, FaCheck, FaBox, FaMapMarkerAlt } from 'react-icons/fa';

const DeliveryDashboard = () => {
  const { orders, customerLocations, loading, markAsDelivered } = DeliveryData();
  const [filter, setFilter] = useState('all'); // all, pending, delivered
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);

  const handleMarkAsDelivered = (orderId, orderStatus) => {
    if (orderStatus === 'Delivered') {
      return;
    }
    if (window.confirm('Mark this order as delivered?')) {
      markAsDelivered(orderId);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Assigned':
        return 'bg-blue-100 text-blue-700';
      case 'Delivered':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredOrders = Array.isArray(orders) ? orders.filter(order => {
    if (filter === 'pending') return order.status !== 'Delivered';
    if (filter === 'delivered') return order.status === 'Delivered';
    return true;
  }) : [];

  const pendingCount = Array.isArray(orders) ? orders.filter(o => o.status !== 'Delivered').length : 0;
  const deliveredCount = Array.isArray(orders) ? orders.filter(o => o.status === 'Delivered').length : 0;

  // Initialize map - MUST be before any conditional returns
  useEffect(() => {
    if (!mapContainer.current || map.current || !Array.isArray(customerLocations) || customerLocations.length === 0) return;

    try {
      // Create map instance
      const maptilersdk = window.maptilersdk;
      if (!maptilersdk) {
        console.error('MapTiler SDK not loaded');
        return;
      }

      maptilersdk.config.apiKey = import.meta.env.VITE_MAP_API;

      const centerCoords = customerLocations[0]?.coords || [74.1850, 17.2853];

      map.current = new maptilersdk.Map({
        container: mapContainer.current,
        style: maptilersdk.MapStyle.STREETS,
        center: centerCoords,
        zoom: 12
      });

      // Add markers for each customer location
      customerLocations.forEach((location) => {
        if (location && location.coords && Array.isArray(location.coords)) {
          const marker = new maptilersdk.Marker({ color: 'red' })
            .setLngLat(location.coords)
            .setPopup(
              new maptilersdk.Popup({ offset: 25 })
                .setHTML(`<div style="padding: 5px;"><strong>${location.name || 'Customer'}</strong></div>`)
            )
            .addTo(map.current);
          
          markersRef.current.push(marker);
        }
      });

      // Fit map to show all markers
      if (customerLocations.length > 1) {
        const bounds = new maptilersdk.LngLatBounds();
        customerLocations.forEach(location => {
          if (location && location.coords && Array.isArray(location.coords)) {
            bounds.extend(location.coords);
          }
        });
        map.current.fitBounds(bounds, { padding: 50 });
      }
    } catch (error) {
      console.error('Error initializing map:', error);
    }

    return () => {
      try {
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      } catch (error) {
        console.error('Error cleaning up map:', error);
      }
    };
  }, [customerLocations]);

  // Loading check AFTER all hooks
  if (loading) {
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
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Delivery Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your delivery assignments</p>
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
                <p className="text-3xl font-bold text-gray-900">{Array.isArray(orders) ? orders.length : 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FaTruck className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Pending Deliveries</p>
                <p className="text-3xl font-bold text-gray-900">{pendingCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FaCheck className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-3xl font-bold text-gray-900">{deliveredCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Locations Map */}
        {Array.isArray(customerLocations) && customerLocations.length > 0 && (
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Delivery Locations Map</p>
                    <p className="text-sm text-gray-600">
                      {customerLocations.length} pending delivery location{customerLocations.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>
              <div ref={mapContainer} style={{ width: '100%', height: '400px' }} />
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              filter === 'all'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            All ({Array.isArray(orders) ? orders.length : 0})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('delivered')}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              filter === 'delivered'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Delivered ({deliveredCount})
          </button>
        </div>

        {/* Orders List */}
        {!filteredOrders || filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <FaBox className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">
              {filter === 'all' && 'No orders assigned yet'}
              {filter === 'pending' && 'No pending deliveries'}
              {filter === 'delivered' && 'No delivered orders'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
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

                  {/* Delivery Address */}
                  {order.user?.address && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        <FaMapMarkerAlt className="inline mr-2 text-red-500" />
                        <span className="font-semibold">Delivery Address:</span>{' '}
                        <span className="text-gray-900">{order.user.address}</span>
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

                  {/* Action Button */}
                  {order.status !== 'Delivered' && (
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => handleMarkAsDelivered(order._id, order.status)}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors duration-200"
                      >
                        <FaCheck className="w-4 h-4" />
                        Mark as Delivered
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default DeliveryDashboard;
