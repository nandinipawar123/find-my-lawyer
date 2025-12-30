import axios from 'axios';

// Use Replit domain for development
const getApiUrl = () => {
    // In Replit environment, we can use the dev domain with the correct protocol
    // The backend runs on port 3000, but Replit's proxy handles the routing
    // However, if we're calling a separate port, we might need the full URL
    const domain = window.location.hostname.replace('5000', '3000');
    return `https://${domain}/api`;
};

const api = axios.create({
    baseURL: '/api', // Use relative path and proxy in vite for easier dev
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
