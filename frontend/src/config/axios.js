import axios from 'axios';

// Configure axios baseURL based on environment
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  withCredentials: true,
});

export default instance;
