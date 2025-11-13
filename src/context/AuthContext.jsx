// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { setAuthToken } from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        setAuthToken(token);
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({ email: payload.sub, role: payload.role });
      } catch (err) {
        console.error("Invalid token:", err);
        logout();
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    setAuthToken(token);
    const payload = JSON.parse(atob(token.split(".")[1]));
    setUser({ email: payload.sub, role: payload.role });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
