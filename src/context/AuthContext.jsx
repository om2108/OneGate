import { createContext, useContext, useEffect, useState } from "react";
import { setAuthToken } from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  // ✅ Safe JWT decode
  const decodeToken = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  };

  // ✅ Expiry check
  const isTokenExpired = (exp) => {
    if (!exp) return true;
    return Date.now() >= exp * 1000;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const payload = decodeToken(token);

      if (!payload || isTokenExpired(payload.exp)) {
        localStorage.removeItem("token");
        setAuthToken(null);
        setUser(null);
      } else {
        setAuthToken(token);
        setUser({
          id: payload.id,
          email: payload.sub,
          role: payload.role,
          token,
        });
      }
    }

    setIsReady(true);
  }, []);

  // ✅ LOGIN
  const login = (token) => {
    const payload = decodeToken(token);

    if (!payload || isTokenExpired(payload.exp)) {
      alert("Session expired. Please login again.");
      logout();
      return;
    }

    localStorage.setItem("token", token);
    setAuthToken(token);

    setUser({
      id: payload.id,
      email: payload.sub,
      role: payload.role,
      token,
    });
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    setUser(null);
  };

  if (!isReady) return null;

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
