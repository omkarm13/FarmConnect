import { useState } from 'react';
import { VegetableData } from '../context/VegetableContext.jsx';

const Reviews = ({ vegetable, user }) => {
  const { createReview, deleteReview } = VegetableData();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment) {
      return;
    }
    createReview(vegetable._id, { rating, comment });
    setComment('');
    setRating(5);
  };

  const handleDelete = (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteReview(vegetable._id, reviewId);
    }
  };

  return (
    <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6 md:p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Reviews</h2>

      {user && user.data && user.data.user && user.data.user.role === 'customer' && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Leave a Review</h3>
          <div className="mb-3">
            <label htmlFor="rating" className="block text-base font-medium text-gray-700 mb-1">
              Rating :
            </label>
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                  <button
                    key={starValue}
                    type="button"
                    style={{ fontSize: '2rem' }}
                    className={`${
                      starValue <= rating ? 'text-yellow-400' : 'text-gray-300'
                    } focus:outline-none hover:scale-110 transition-transform leading-none`}
                    onClick={() => setRating(starValue)}
                  >
                    &#9733;
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="comment" className="block text-base font-medium text-gray-700 mb-1">
              Comment :
            </label>
            <textarea
              id="comment"
              rows="3"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors duration-200"
          >
            Submit Review
          </button>
        </form>
      )}

      <div className="space-y-4">
        {vegetable.reviews && vegetable.reviews.length > 0 ? (
          vegetable.reviews.map((review) => (
            <div key={review._id} className="p-4 border rounded-lg bg-white shadow-sm">
              <div className="flex items-center mb-2">
                <div className="font-semibold text-gray-800 text-xl">{review.author.name}</div>
                <div className="ml-auto flex items-center gap-2">
                  <div className="text-3xl">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">&#9733;</span>
                    ))}
                    {[...Array(5 - review.rating)].map((_, i) => (
                      <span key={i} className="text-gray-300">&#9733;</span>
                    ))}
                  </div>
                  {user && user.data && user.data.user && user.data.user._id === review.author._id && (
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
              <p className="text-gray-600 text-lg">{review.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default Reviews;
