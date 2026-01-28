import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(() => {
    // Initialize from localStorage immediately
    return localStorage.getItem("isAdmin") === "true";
  });
  const [loading, setLoading] = useState(false);

  const login = () => {
    localStorage.setItem("isAdmin", "true");
    setIsAdmin(true);
  };

  const logout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminUsername");
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
