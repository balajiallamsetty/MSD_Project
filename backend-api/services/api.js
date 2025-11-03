import axios from 'axios';


const API_URL =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV ? 'http://localhost:5000' : 'https://msd-project-lim3.onrender.com');

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true // Important for CORS with credentials
});

// Request interceptor for adding auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Handle specific error codes
            switch (error.response.status) {
                case 401:
                    // Unauthorized - clear token and redirect to login
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    break;
                case 403:
                    // Forbidden
                    console.error('Access forbidden');
                    break;
                case 404:
                    // Not found
                    console.error('Resource not found');
                    break;
                case 500:
                    // Server error
                    console.error('Server error');
                    break;
                default:
                    console.error('An error occurred');
            }
        } else if (error.request) {
            // Network error
            console.error('Network error');
        }
        return Promise.reject(error);
    }
);

// Auth endpoints
export const auth = {
    login: (credentials) => api.post('/api/users/login', credentials),
    signup: (userData) => api.post('/api/users/signup', userData),
    logout: () => {
        localStorage.removeItem('token');
        return Promise.resolve();
    }
};

// User endpoints
export const user = {
    getProfile: () => api.get('/api/users/profile'),
    updateProfile: (data) => api.put('/api/users/profile', data),
    updatePassword: (data) => api.put('/api/users/password', data)
};

// Health data endpoints
export const health = {
    saveHealthData: (data) => api.post('/api/users/health-data', data),
    getHealthData: () => api.get('/api/users/health-data'),
    updateHealthData: (data) => api.put('/api/users/health-data', data)
};

// Progress tracking endpoints
export const progress = {
    saveProgress: (data) => api.post('/api/progress', data),
    getProgress: () => api.get('/api/progress'),
    updateProgress: (id, data) => api.put(`/api/progress/${id}`, data),
    deleteProgress: (id) => api.delete(`/api/progress/${id}`)
};

// Meal planning endpoints
export const meals = {
    saveMealPlan: (data) => api.post('/api/meals', data),
    getMealPlans: () => api.get('/api/meals'),
    updateMealPlan: (id, data) => api.put(`/api/meals/${id}`, data),
    deleteMealPlan: (id) => api.delete(`/api/meals/${id}`)
};

export default api;