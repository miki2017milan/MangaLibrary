import { createContext, ReactNode, useState, useContext, useEffect } from "react";
import axios from "axios";

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

type AuthContextType = {
  displayName: string;
  login: (email: string, password: string) => any;
  logout: () => void;
  register: (
    email: string,
    newDisplayName: string,
    password: string,
    passwordConfirm: string
  ) => any;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

type Props = {
  children: ReactNode;
};

type ProfileResponse = {
  displayName: string;
};

const accountUrl = "https://localhost:6060/api/account";

export function AuthProvider({ children }: Props) {
  const [displayName, setDisplayName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.get<ProfileResponse>(accountUrl + "/profile");
        setDisplayName(response.data.displayName);
      } catch (error) {
        logout();
      }
    }
    setLoading(false);
  };

  const register = async (
    email: string,
    newDisplayName: string,
    password: string,
    passwordConfirm: string
  ) => {
    try {
      const response = await axios.post(accountUrl + "/register", {
        email,
        newDisplayName,
        password,
        passwordConfirm,
      });

      const { token } = response.data;
      localStorage.setItem("token", token);
      checkAuth();

      return { succsess: true };
    } catch (error: any) {
      return { succsess: false, errors: error.response?.data?.message || "Register Failed" };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(accountUrl + "/login", {
        email,
        password,
      });

      const { token } = response.data;
      console.log(response.data);
      localStorage.setItem("token", token);
      checkAuth();

      return { succsess: true };
    } catch (error: any) {
      return { succsess: false, errors: error.response?.data?.message || "Login Failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem(displayName);
    setDisplayName("");
  };

  return (
    <AuthContext.Provider
      value={{
        displayName: displayName,
        login: login,
        logout: logout,
        register: register,
        loading: loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
