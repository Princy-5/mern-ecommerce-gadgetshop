import axios from "axios";

// ✅ EXPLICITLY set the base URL
const API_BASE = "http://16.16.52.37:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Add request interceptor to log all requests
api.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', config.method?.toUpperCase(), config.baseURL + config.url);
    console.log('📦 Request Data:', config.data);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.baseURL + error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    return Promise.reject(error);
  }
);

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
};

// Initialize token
const token = localStorage.getItem("token");
if (token) setAuthToken(token);

export const loginUser = async ({ email, password }) => {
  const res = await api.post("/users/login", { email, password });
  return res.data;
};

export const signupUser = async ({ name, email, password }) => {
  const res = await api.post("/users/signup", { name, email, password });
  return res.data;
};

export const forgotPassword = async ({ email }) => {
  const res = await api.post("/users/forgot-password", { email });
  return res.data;
};

export { api };
