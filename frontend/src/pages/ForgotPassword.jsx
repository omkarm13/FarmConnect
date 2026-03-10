import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserData } from '../context/UserContext.jsx';
import { LoadingAnimation } from '../components/Loading.jsx';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const { forgotPassword, btnLoading } = UserData();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword(email, navigate);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Forgot Password</h2>
        
        <p className="text-gray-600 text-center mb-6">
          Enter your email address and we'll send you an OTP to reset your password.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your email"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200 font-medium"
            disabled={btnLoading}
          >
            {btnLoading ? <LoadingAnimation /> : "Send OTP"}
          </button>
        </form>

        {/* Back to Login Link */}
        <p className="text-center text-gray-600 mt-4">
          Remember your password?{' '}
          <a href="/login" className="text-green-600 hover:text-green-700 font-medium">
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
