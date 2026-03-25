import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptors if needed
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle error globally
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
