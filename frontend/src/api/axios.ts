import axios from 'axios';

// Use window.location to dynamically construct the backend URL
const getApiUrl = () => {
    const host = window.location.host;
    // In development (Replit), use the same domain with port 3000
    // In production, use the same domain without port
    return `http://${host.split(':')[0]}:3000/api`;
};

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || getApiUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
