import axios from 'axios';

// Configure axios baseURL based on environment
// In production (Render), use relative URLs since backend serves frontend
// In development, use localhost
const instance = axios.create({
  baseURL: import.meta.env.MODE === 'production' ? '' : 'http://localhost:5000',
  withCredentials: true,
});

export default instance;
