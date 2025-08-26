import axios from "axios";

const AUTH_BASE_URL = import.meta.env.VITE_AUTH_API_URL || "http://localhost:3000";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

// Both signup and login return the same simple format
export interface AuthResponse {
  email: string;
  token: string;
}

const authClient = axios.create({
  baseURL: AUTH_BASE_URL,
});

authClient.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers = config.headers || {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

authClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      try {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      } catch {}
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default {
  signup: (payload: SignupPayload) => authClient.post<AuthResponse>("/signup", payload),
  login: (payload: LoginPayload) => authClient.post<AuthResponse>("/login", payload),
  logout: () => authClient.post("/logout"),
};


