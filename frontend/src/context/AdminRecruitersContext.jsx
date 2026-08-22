import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { adminApi } from "../api/admin";
import { getApiErrorMessage } from "../api/client";

const AdminRecruitersContext = createContext(null);

export const AdminRecruitersProvider = ({ children }) => {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const loadRecruiters = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await adminApi.getRecruiters();
      setRecruiters(Array.isArray(data) ? data : []);
    } catch (err) {
      setRecruiters([]);
      setError(getApiErrorMessage(err, "Unable to load recruiter accounts."));
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRecruiterStatus = useCallback(async (recruiterId, status) => {
    setUpdatingId(recruiterId);
    try {
      const { data } = await adminApi.updateRecruiterStatus(recruiterId, status);
      setRecruiters((current) => current.map((item) => (item.id === recruiterId ? data : item)));
      return data;
    } catch (err) {
      throw new Error(getApiErrorMessage(err, "Unable to update recruiter status."));
    } finally {
      setUpdatingId(null);
    }
  }, []);

  const value = useMemo(
    () => ({ recruiters, loading, updatingId, error, loadRecruiters, updateRecruiterStatus }),
    [recruiters, loading, updatingId, error, loadRecruiters, updateRecruiterStatus]
  );

  return <AdminRecruitersContext.Provider value={value}>{children}</AdminRecruitersContext.Provider>;
};

export const useAdminRecruiters = () => {
  const context = useContext(AdminRecruitersContext);
  if (!context) throw new Error("useAdminRecruiters must be used inside AdminRecruitersProvider");
  return context;
};
