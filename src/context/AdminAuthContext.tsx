import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  apiRequest,
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from "@/lib/api-client";

interface AdminUser {
  id: string;
  email: string;
  name: string;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined
);

export function AdminAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const storedAdmin = localStorage.getItem("admin");
      const token = getStoredToken("admin");

      if (storedAdmin && token) {
        setAdmin(JSON.parse(storedAdmin));
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await apiRequest<{
        admin: AdminUser;
        token: string;
      }>("/api/admins/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      setStoredToken(data.token, "admin");
      localStorage.setItem("admin", JSON.stringify(data.admin));
      setAdmin(data.admin);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = async () => {
    clearStoredToken("admin");
    localStorage.removeItem("admin");
    setAdmin(null);
    router.push("/admin/login");
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        loading,
        login,
        logout,
        isAuthenticated: !!admin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
}
