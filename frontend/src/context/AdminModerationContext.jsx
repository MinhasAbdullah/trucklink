import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { adminApi } from "../api/admin";
import { getApiErrorMessage } from "../api/client";

const AdminModerationContext = createContext(null);

export const AdminModerationProvider = ({ children }) => {
  const [drivers, setDrivers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState("");
  const [analyticsError, setAnalyticsError] = useState("");

  const loadQueue = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await adminApi.getModerationQueue();
      setDrivers(Array.isArray(data) ? data : []);
    } catch (err) {
      setDrivers([]);
      const status = err?.response?.status;
      const message = status === 500
        ? "The moderation queue endpoint returned 500. The backend queue queryset needs to be fixed before pending drivers can load."
        : getApiErrorMessage(err, "Unable to load the moderation queue.");
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);
    setAnalyticsError("");
    try {
      const { data } = await adminApi.getAnalytics();
      setAnalytics(data);
      return data;
    } catch (err) {
      setAnalyticsError(getApiErrorMessage(err, "Unable to load platform analytics."));
      return null;
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  const loadDashboard = useCallback(async () => {
    await Promise.allSettled([loadQueue(), loadAnalytics()]);
  }, [loadQueue, loadAnalytics]);

  const moderateDriver = useCallback(async (driverId, action, comment) => {
    setActionLoadingId(driverId);
    try {
      const { data } = await adminApi.moderateDriver(driverId, { action, comment });
      if (action === "approve" || action === "reject") {
        setDrivers((current) => current.filter((driver) => driver.id !== driverId));
      } else {
        setDrivers((current) =>
          current.map((driver) => (driver.id === driverId ? data : driver))
        );
      }
      setAnalytics((current) => {
        if (!current?.driver_status_breakdown) return current;
        const next = structuredClone(current);
        if (action === "approve") {
          next.driver_status_breakdown.pending = Math.max(0, next.driver_status_breakdown.pending - 1);
          next.driver_status_breakdown.approved += 1;
        } else if (action === "reject") {
          next.driver_status_breakdown.pending = Math.max(0, next.driver_status_breakdown.pending - 1);
          next.driver_status_breakdown.rejected += 1;
        }
        return next;
      });
      return data;
    } catch (err) {
      throw new Error(getApiErrorMessage(err, "Moderation action failed."));
    } finally {
      setActionLoadingId(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      drivers,
      analytics,
      loading,
      analyticsLoading,
      actionLoadingId,
      error,
      analyticsError,
      loadQueue,
      loadAnalytics,
      loadDashboard,
      moderateDriver,
    }),
    [
      drivers,
      analytics,
      loading,
      analyticsLoading,
      actionLoadingId,
      error,
      analyticsError,
      loadQueue,
      loadAnalytics,
      loadDashboard,
      moderateDriver,
    ]
  );

  return (
    <AdminModerationContext.Provider value={value}>
      {children}
    </AdminModerationContext.Provider>
  );
};

export const useAdminModeration = () => {
  const context = useContext(AdminModerationContext);
  if (!context) throw new Error("useAdminModeration must be used inside AdminModerationProvider");
  return context;
};
