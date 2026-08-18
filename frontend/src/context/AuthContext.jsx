import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { adminApi } from "../api/admin";
import { authApi } from "../api/auth";
import { clearStoredAuth, getApiErrorMessage, STORAGE_KEYS } from "../api/client";
import { driverApi } from "../api/drivers";
import { recruiterApi } from "../api/recruiters";

const AuthContext = createContext(null);

const readStoredUser = () => {
  const access = localStorage.getItem(STORAGE_KEYS.access);
  const role = localStorage.getItem(STORAGE_KEYS.role);
  const username = localStorage.getItem(STORAGE_KEYS.username);
  return access && role ? { role, username } : null;
};

export const getRoleHome = (role) => {
  if (role === "admin") return "/admin/dashboard";
  if (role === "recruiter") return "/recruiter/dashboard";
  if (role === "driver") return "/driver";
  return "/";
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser);
  const [initializing, setInitializing] = useState(true);

  const logout = useCallback(() => {
    clearStoredAuth();
    setUser(null);
  }, []);

  useEffect(() => {
    const handleExpired = () => logout();
    window.addEventListener("trucklink:auth-expired", handleExpired);
    setInitializing(false);
    return () => window.removeEventListener("trucklink:auth-expired", handleExpired);
  }, [logout]);

  const validateSelectedRole = useCallback(async (role) => {
    try {
      if (role === "admin") {
        await adminApi.getAnalytics();
        return;
      }
      if (role === "recruiter") {
        await recruiterApi.getMyJobs();
        return;
      }
      if (role === "driver") {
        try {
          await driverApi.getMyProfile();
        } catch (error) {
          // The backend currently throws 500 when a valid driver has no profile.
          // 403 is the meaningful signal that the selected role is wrong.
          if (error.response?.status === 403) throw error;
        }
      }
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error(`This account does not have ${role} access.`);
      }
      throw error;
    }
  }, []);

  const login = useCallback(async ({ username, password, role, rememberMe = false }) => {
    try {
      const { data } = await authApi.login({ username, password });
      localStorage.setItem(STORAGE_KEYS.access, data.access);
      localStorage.setItem(STORAGE_KEYS.refresh, data.refresh);
      localStorage.setItem(STORAGE_KEYS.role, role);
      localStorage.setItem(STORAGE_KEYS.username, username);

      try {
        await validateSelectedRole(role);
      } catch (error) {
        clearStoredAuth();
        throw error;
      }

      const nextUser = { username, role, rememberMe };
      setUser(nextUser);
      return nextUser;
    } catch (error) {
      if (error instanceof Error && !error.response) throw error;
      throw new Error(getApiErrorMessage(error, "Invalid username or password."));
    }
  }, [validateSelectedRole]);

  const signup = useCallback(async ({ role, username, email, password }) => {
    try {
      const { data } = await authApi.signup(role, { username, email, password });
      return data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Registration failed."));
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      role: user?.role || null,
      isAuthenticated: Boolean(user),
      initializing,
      login,
      signup,
      logout,
    }),
    [user, initializing, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
