import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authStorage } from "@/utils/authStorage";
import { adminService } from "@/services/adminService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => authStorage.getAdmin());
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    authStorage.clear();
    setAdmin(null);
  }, []);

  const login = useCallback(async (username, password) => {
    const res = await adminService.login({ username, password });
    authStorage.setToken(res.data.token);
    authStorage.setAdmin(res.data.admin);
    setAdmin(res.data.admin);
    return res.data;
  }, []);

  useEffect(() => {
    const token = authStorage.getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    adminService
      .me()
      .then((res) => {
        setAdmin(res.data);
        authStorage.setAdmin(res.data);
      })
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, [logout]);

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
