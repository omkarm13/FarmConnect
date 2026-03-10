import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartData } from '../context/CartContext.jsx';
import { OrderData } from '../context/OrderContext.jsx';
import { Loading } from '../components/Loading.jsx';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';

const Cart = () => {
  const { cart, loading, updateCartItem, removeFromCart, fetchCart } = CartData();
  const { placeOrder } = OrderData();
  const navigate = useNavigate();
  const [placingOrder, setPlacingOrder] = useState(false);

  const handleQuantityChange = (vegId, newQuantity) => {
    if (newQuantity < 1) return;
    updateCartItem(vegId, newQuantity);
  };

  const handleRemove = (vegId) => {
    if (window.confirm('Remove this item from cart?')) {
      removeFromCart(vegId);
    }
  };

  const calculateTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => {
      return total + (item.vegetable?.price || 0) * item.quantity;
    }, 0);
  };

  const handlePlaceOrder = async () => {
    setPlacingOrder(true);
    const result = await placeOrder();
    setPlacingOrder(false);
    if (result.success) {
      await fetchCart();
      navigate('/orders');
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
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-10">Shopping Cart</h1>

        {!cart?.items || cart.items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-200"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {cart.items.map((item) => (
                  <div
                    key={item.vegetable._id}
                    className="flex items-center gap-6 p-6 border-b border-gray-100 last:border-b-0"
                  >
                    <Link to={`/vegetables/${item.vegetable._id}`}>
                      {item.vegetable.image?.url ? (
                        <img
                          src={item.vegetable.image.url}
                          alt={item.vegetable.title}
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-sm">No image</span>
                        </div>
                      )}
                    </Link>

                    <div className="flex-1">
                      <Link
                        to={`/vegetables/${item.vegetable._id}`}
                        className="text-xl font-semibold text-gray-900 hover:text-green-600 transition-colors"
                      >
                        {item.vegetable.title}
                      </Link>
                      <p className="text-gray-600 mt-2 text-lg">
                        ₹{item.vegetable.price} / kg
                      </p>
                      <p className="text-base text-gray-500 mt-1">
                        Available: {item.vegetable.quantity} kg
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item.vegetable._id, item.quantity - 1)}
                          className="p-3 hover:bg-gray-100 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <FaMinus className="w-4 h-4 text-gray-600" />
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.vegetable._id, parseInt(e.target.value) || 1)}
                          className="w-20 text-center border-x border-gray-300 py-3 text-lg focus:outline-none"
                          min="1"
                          max={item.vegetable.quantity}
                        />
                        <button
                          onClick={() => handleQuantityChange(item.vegetable._id, item.quantity + 1)}
                          className="p-3 hover:bg-gray-100 transition-colors"
                          disabled={item.quantity >= item.vegetable.quantity}
                        >
                          <FaPlus className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>

                      <p className="text-xl font-semibold text-gray-900 w-28 text-right">
                        ₹{(item.vegetable.price * item.quantity).toFixed(2)}
                      </p>

                      <button
                        onClick={() => handleRemove(item.vegetable._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FaTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>₹{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                  className="w-full bg-green-600 text-white py-3 rounded-full font-medium hover:bg-green-700 transition-colors duration-200 mb-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {placingOrder ? 'Placing Order...' : 'Place Order'}
                </button>

                <Link
                  to="/"
                  className="block text-center text-green-600 hover:text-green-700 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Cart;
