import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { VegetableData } from "../context/VegetableContext.jsx";
import { Loading } from '../components/Loading.jsx';
import { FaTimes } from 'react-icons/fa';

const Home = () => {
  const { vegetables, loading, searchQuery, clearSearch } = VegetableData();
  const [sortBy, setSortBy] = useState('newest');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Filter and sort vegetables
  const filteredAndSortedVegetables = useMemo(() => {
    if (!vegetables) return [];
    
    let filtered = [...vegetables];
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(veg => veg.category.toLowerCase() === categoryFilter.toLowerCase());
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    
    return filtered;
  }, [vegetables, categoryFilter, sortBy]);

  return (
    <main className="bg-gray-50 px-6 py-6">
      <div className="max-w-6xl mx-auto">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'All Vegetables'}
            </h1>
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="mt-2 inline-flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium"
              >
                <FaTimes /> Clear Search
              </button>
            )}
            {vegetables && vegetables.length > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                {filteredAndSortedVegetables.length} {filteredAndSortedVegetables.length === 1 ? 'vegetable' : 'vegetables'} found
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-full px-4 py-2 text-sm text-gray-700 bg-white shadow-sm focus:outline-none focus:border-green-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border rounded-full px-4 py-2 text-sm text-gray-700 bg-white shadow-sm focus:outline-none focus:border-green-500"
            >
              <option value="all">All Categories</option>
              <option value="roots">Roots</option>
              <option value="leaves">Leaves</option>
              <option value="pods">Pods</option>
              <option value="flowers">Flowers</option>
              <option value="fruits">Fruits</option>
            </select>
          </div>
        </div>

        {/* Grid of vegetable cards */}
        {loading ? (
        <Loading />
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedVegetables && filteredAndSortedVegetables.length > 0 ? (
            filteredAndSortedVegetables.map((veg) => (
              <article
                key={veg._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col text-sm"
              >
                {veg.image?.url && (
                  <img
                    src={veg.image.url}
                    alt={veg.title}
                    className="h-72 w-full object-cover"
                  />
                )}

                <div className="p-3 flex flex-col gap-1 flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 tracking-tight leading-snug">
                    {veg.title}
                  </h2>
                  <p className="text-base text-gray-700 leading-tight">
                    <span className="font-semibold text-gray-900">Available Qty:</span> 
                    {veg.quantity > 0 ? (
                      ` ${veg.quantity} kg`
                    ) : (
                      <span className="ml-2 text-red-600 font-semibold">Out of Stock</span>
                    )}
                  </p>
                  <p className="text-base text-gray-700 leading-tight">
                    <span className="font-semibold text-gray-900">Category:</span> {veg.category}
                  </p>
                  {veg.location && (
                    <p className="text-base text-gray-700 leading-tight">
                      <span className="font-semibold text-gray-900">Location:</span> {veg.location}
                    </p>
                  )}
                  <p className="text-lg font-semibold text-green-700 leading-tight mt-1">
                    ₹{veg.price} <span className="text-base font-normal text-gray-700">/ kg</span>
                  </p>

                  <div className="mt-3">
                    <Link
                      to={`/vegetables/${veg._id}`}
                      className="btn-link inline-flex items-center justify-center px-4 py-2 rounded-full bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors duration-200"
                    >
                      See Details
                    </Link>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 text-lg">
                {searchQuery ? `No vegetables found for "${searchQuery}"` : 'No vegetables available.'}
              </p>
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                >
                  <FaTimes /> Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      )}
      </div>
    </main>
  );
};

export default Home;