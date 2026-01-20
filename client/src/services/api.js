import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Interceptor to add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getWeather = async (city) => {
    try {
        const response = await api.get(`/weather?city=${city}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { error: 'Network Error' };
    }
};

export const getHistory = async () => {
    try {
        const response = await api.get('/history');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch history", error);
        return [];
    }
};

export default api;
