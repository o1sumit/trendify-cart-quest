import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { User } from "@/lib/mock-data";
import authService, {
  LoginPayload,
  SignupPayload,
} from "@/services/api/auth/authService";

interface UserContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  updateUser: (userData: Partial<User>) => void;
  login: (payload: LoginPayload) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("authUser");
      const storedToken = localStorage.getItem("authToken");
      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedToken) setToken(storedToken);
    } catch {}
  }, []);

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...userData } as User;
      setUser(updated);
      try {
        localStorage.setItem("authUser", JSON.stringify(updated));
      } catch {}
    }
  };

  const login = async (payload: LoginPayload) => {
    const { data } = await authService.login(payload);
    // Login response is simple like signup - only email and token
    const normalizedUser: User = {
      id: data.email, // Use email as ID for login
      name: data.email, // Use email as name since we don't have more info
      email: data.email,
      avatar: "/placeholder.svg",
      joinDate: new Date().toISOString().slice(0, 10),
    };
    setToken(data.token);
    setUser(normalizedUser);
    try {
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("authUser", JSON.stringify(normalizedUser));
    } catch {}
  };

  const signup = async (payload: SignupPayload) => {
    const { data } = await authService.signup(payload);
    // Simplified signup response - only email and token
    const normalizedUser: User = {
      id: data.email, // Use email as ID for signup
      name: payload.fullName || payload.username || data.email,
      email: data.email,
      avatar: "/placeholder.svg",
      joinDate: new Date().toISOString().slice(0, 10),
    };
    setToken(data.token);
    setUser(normalizedUser);
    try {
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("authUser", JSON.stringify(normalizedUser));
    } catch {}
  };

  const logout = () => {
    try {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
    } catch {}
    setUser(null);
    setToken(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        updateUser,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
