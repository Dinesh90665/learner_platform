import axios from "axios";

const axiosClient = axios.create({
    baseURL: "https://learner-platform-3.onrender.com/api/",
    headers: {
        "Content-Type": "application/json",
    },
});

// Automatically add JWT access token
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosClient;