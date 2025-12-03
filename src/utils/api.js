import axios from "axios";

// Backend API URL - defaults to localhost if not specified
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// Create axios instance with default config
export const api = axios.create({ 
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // No response received
      console.error('Network Error: Backend may be offline');
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API helper functions
export const examAPI = {
  // Get all companies with tests
  getCompanies: () => api.get('/api/companies/'),
  
  // Get specific test details
  getTest: (testId) => api.get(`/api/test/${testId}/`),
  
  // Start an exam session
  startSession: (testId, username) => api.post('/api/start-session/', { test_id: testId, username }),
  
  // Submit exam answers
  submitExam: (sessionId, answers) => api.post('/api/submit/', { session_id: sessionId, answers }),
  
  // Log proctoring event
  logEvent: (sessionId, event) => api.post('/api/log/', { session_id: sessionId, event }),
  
  // Upload snapshot
  uploadSnapshot: (sessionId, imageData) => {
    const formData = new FormData();
    formData.append('session_id', sessionId);
    
    // Convert base64 to blob
    const byteString = atob(imageData.split(',')[1]);
    const mimeString = imageData.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });
    formData.append('image', blob, 'snapshot.jpg');
    
    return api.post('/api/upload-snapshot/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

export default api;
