import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VegetableData } from '../context/VegetableContext.jsx';
import { CartData } from '../context/CartContext.jsx';
import { Loading } from '../components/Loading.jsx';
import { FaEdit, FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import Reviews from './Reviews.jsx';

const VegetablePage = ({user}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading, fetchVegetable, vegetable, updateVegetable, deleteVegetable } = VegetableData();
  const { addToCart } = CartData();

  const [edit, setEdit] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    category: "",
    quantity: "",
  });

  const editHandler = () => {
    setFormData({
      title: vegetable.title,
      description: vegetable.description,
      price: vegetable.price,
      location: vegetable.location,
      category: vegetable.category,
      quantity: vegetable.quantity,
    });
    setEdit(true);
  }

  useEffect(() => {
    if (id) {
      fetchVegetable(id);
    }
  }, [id]);

  const handleCancel = () => {
    setEdit(false);
  };

  const handleUpdate = () => {
    updateVegetable(id, formData, setEdit);;
  };

  const handleAddToCart = () => {
    addToCart(id, cartQuantity);
    setCartQuantity(1);
  };

  const handleDelete = async () => {
    const success = await deleteVegetable(id, navigate);
    if (success) {
      setShowDeleteConfirm(false);
    }
  };

if (loading && !vegetable?._id) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loading />
      </main>
    );
  }

  if (!vegetable) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Vegetable not found.</p>
      </main>
    );
  }


  return (
    <main className="bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Image on top as part of card */}
          {vegetable.image?.url ? (
            <img
              src={vegetable.image.url}
              alt={vegetable.title}
              className="w-full max-h-[420px] object-cover"
            />
          ) : (
            <div className="h-64 w-full flex items-center justify-center text-gray-400 text-sm bg-gray-50">
              No image available
            </div>
          )}

          {/* Details under image */}
          <section className="p-6 md:p-8 flex flex-col gap-6">
          {/* Title & Category */}
          <div className="flex flex-col gap-2">
            {edit ? (
              <>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={(e) => {setFormData({...formData, title: e.target.value})}}
                  className="w-full max-w-md rounded-lg border border-gray-300 px-3 py-2 text-sm md:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                  placeholder="Enter title"
                />
              </>
            ) : (
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">
                {vegetable.title}
              </h1>
            )}

            {edit ? (
              <div className="mt-3 max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="category">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={(e) => {setFormData({...formData, category: e.target.value})}}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm md:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                >
                  <option value="">Select a category</option>
                  <option value="roots">Roots</option>
                  <option value="leaves">Leaves</option>
                  <option value="pods">Pods</option>
                  <option value="flowers">Flowers</option>
                  <option value="fruits">Fruits</option>
                </select>
              </div>
            ) : (
              vegetable.category && (
                <div className="mt-1 flex flex-col gap-1">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Category
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-sm font-semibold uppercase">
                    {vegetable.category}
                  </span>
                </div>
              )
            )}
          </div>

          {/* Location & Quantity */}
          <div className="grid sm:grid-cols-2 gap-4 text-base md:text-lg text-gray-700">
            <div>
              {edit ? (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="location">
                    Location
                  </label>
                  <input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={(e) => {setFormData({...formData, location: e.target.value})}}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm md:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                    placeholder="Enter location"
                  />
                </>
              ) : (
                vegetable.location && (
                  <p>
                    <span className="font-semibold text-gray-900">Location:</span> {vegetable.location}
                  </p>
                )
              )}
            </div>
            <div>
              {edit ? (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="quantity">
                    Available Qty (kg)
                  </label>
                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => {setFormData({...formData, quantity: e.target.value})}}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm md:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                    placeholder="Enter quantity (kg)"
                  />
                </>
              ) : (
                <p>
                  <span className="font-semibold text-gray-900">Available Qty:</span> 
                  {vegetable.quantity > 0 ? (
                    ` ${vegetable.quantity} kg`
                  ) : (
                    <span className="ml-2 text-red-600 font-semibold">Out of Stock</span>
                  )}
                </p>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="mt-2">
            {edit ? (
              <div className="max-w-xs">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="price">
                  Price (₹/kg)
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) => {setFormData({...formData, price: e.target.value})}}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm md:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                  placeholder="Enter price per kg"
                />
              </div>
            ) : (
              <p className="text-3xl font-semibold text-green-700">
                ₹{vegetable.price}
                <span className="text-base md:text-lg font-normal text-gray-600 ml-1">/ kg</span>
              </p>
            )}
          </div>

          {/* Description */}
          <div className="pt-2 text-sm md:text-base text-gray-700 leading-relaxed border-t border-gray-100 mt-2">
            <h2 className="text-sm font-semibold text-gray-900 mb-1">Description</h2>
            {edit ? (
              <textarea
                id="description"
                name="description"
                rows="3"
                value={formData.description}
                onChange={(e) => {setFormData({...formData, description: e.target.value})}}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm md:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                placeholder="Enter description"
              />
            ) : (
              vegetable.description && <p>{vegetable.description}</p>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            { user && user.data && user.data.user && user.data.user.role === "customer" && (
              vegetable.quantity > 0 ? (
                <div className="flex items-end gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (kg)</label>
                    <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                      <button
                        type="button"
                        onClick={() => setCartQuantity(Math.max(1, cartQuantity - 1))}
                        className="p-2 hover:bg-gray-100 transition-colors"
                        disabled={cartQuantity <= 1}
                      >
                        <FaMinus className="w-4 h-4 text-gray-600" />
                      </button>
                      <input
                        type="number"
                        value={cartQuantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          setCartQuantity(Math.min(Math.max(1, val), vegetable.quantity));
                        }}
                        className="w-16 text-center border-x border-gray-300 py-2 focus:outline-none"
                        min="1"
                        max={vegetable.quantity}
                      />
                      <button
                        type="button"
                        onClick={() => setCartQuantity(Math.min(vegetable.quantity, cartQuantity + 1))}
                        className="p-2 hover:bg-gray-100 transition-colors"
                        disabled={cartQuantity >= vegetable.quantity}
                      >
                        <FaPlus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors duration-200"
                  >
                    Add to Cart
                  </button>
                </div>
              ) : (
                <div className="px-6 py-3 bg-red-50 border border-red-200 rounded-full">
                  <span className="text-red-600 font-semibold">Out of Stock</span>
                </div>
              )
            )}

            {vegetable.owner && user && user.data && user.data.user && user.data.user._id === vegetable.owner._id &&(
              !edit ? (
                <>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-green-600 text-green-700 text-sm font-medium hover:bg-green-50 transition-colors duration-200"
                    onClick={editHandler}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-red-600 text-red-700 text-sm font-medium hover:bg-red-50 transition-colors duration-200"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <FaTrash className="w-4 h-4" />
                    Delete
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors duration-200"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-green-600 bg-green-600 text-white text-sm font-medium hover:bg-green-700 hover:border-green-700 transition-colors duration-200"
                    onClick={handleUpdate}
                  >
                    Update
                  </button>
                </>
              )
            )}

          </div>
          </section>
        </div>

        <Reviews vegetable={vegetable} user={user} />
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Delete Vegetable</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{vegetable.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default VegetablePage;