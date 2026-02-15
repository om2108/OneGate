import axios from "axios";


const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// ⭐ ALWAYS attach token before every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
};

export default api;
