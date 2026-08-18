import React, { useEffect, useMemo } from "react";
import {
  BarChart3,
  CheckCircle,
  Clock,
  RefreshCw,
  TrendingUp,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAdminModeration } from "../../context/AdminModerationContext";
import LoadingState from "../../components/ui/LoadingState";

const StatCard = ({ icon: Icon, label, value, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4 }}
    className="rounded-2xl border border-[#e8f5ee] bg-white p-6 shadow-sm transition-all hover:shadow-lg"
  >
    <div className="flex items-center justify-between">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e8f5ee]">
        <Icon className="h-6 w-6 text-[#2d6a4f]" />
      </div>
      <TrendingUp className="h-4 w-4 text-[#8aa89a]" />
    </div>
    <h3 className="mt-3 text-2xl font-bold text-[#1a2a3a]">{value ?? "—"}</h3>
    <p className="text-sm text-[#4a6a5a]">{label}</p>
    <p className="mt-1 text-xs text-[#8aa89a]">{description}</p>
  </motion.div>
);

const StatusRow = ({ label, value, total, icon: Icon, tone }) => {
  const percentage = total ? Math.round((Number(value || 0) / total) * 100) : 0;
  const barClass =
    tone === "success" ? "bg-[#2d6a4f]" : tone === "danger" ? "bg-red-500" : "bg-amber-500";

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-[#4a6a5a]">
          <Icon className="h-4 w-4" />
          {label}
        </div>
        <div className="text-right">
          <span className="font-semibold text-[#1a2a3a]">{value ?? 0}</span>
          <span className="ml-2 text-xs text-[#8aa89a]">{percentage}%</span>
        </div>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-[#e8f5ee]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.7 }}
          className={`h-full rounded-full ${barClass}`}
        />
      </div>
    </div>
  );
};

const AdminAnalytics = () => {
  const { analytics, analyticsLoading, analyticsError, loadAnalytics } = useAdminModeration();

  useEffect(() => {
    if (!analytics && !analyticsLoading) loadAnalytics();
  }, [analytics, analyticsLoading, loadAnalytics]);

  const breakdown = analytics?.driver_status_breakdown || {};
  const totalStatuses = useMemo(
    () => Number(breakdown.pending || 0) + Number(breakdown.approved || 0) + Number(breakdown.rejected || 0),
    [breakdown.pending, breakdown.approved, breakdown.rejected]
  );
  const totalUsers = analytics
    ? Number(analytics.total_driver_signups || 0) + Number(analytics.total_recruiter_signups || 0)
    : null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-[#1a2a3a]">
            <BarChart3 className="h-6 w-6 text-[#2d6a4f]" />
            Analytics Dashboard
          </h1>
          <p className="text-sm text-[#8aa89a]">Live platform metrics returned by the backend analytics API</p>
        </div>
        <button
          type="button"
          onClick={loadAnalytics}
          disabled={analyticsLoading}
          className="flex items-center gap-2 rounded-xl bg-[#2d6a4f] px-4 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-[#1a4a35] disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${analyticsLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {analyticsError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{analyticsError}</div>
      )}

      {analyticsLoading && !analytics ? (
        <LoadingState label="Loading analytics..." />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard icon={Users} label="Total Users" value={totalUsers} description="Driver + recruiter signups" />
            <StatCard icon={UserCheck} label="Driver Signups" value={analytics?.total_driver_signups} description="Registered driver accounts" />
            <StatCard icon={Clock} label="Pending Profiles" value={breakdown.pending} description="Awaiting moderation" />
            <StatCard icon={TrendingUp} label="Matches Made" value={analytics?.total_matches_made} description="Matches recorded by the platform" />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl border border-[#e8f5ee] bg-white p-6 shadow-sm"
            >
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-[#1a2a3a]">Driver Profile Status</h3>
                <p className="text-xs text-[#8aa89a]">Moderation distribution from the API</p>
              </div>
              <div className="space-y-6">
                <StatusRow label="Approved" value={breakdown.approved} total={totalStatuses} icon={CheckCircle} tone="success" />
                <StatusRow label="Pending" value={breakdown.pending} total={totalStatuses} icon={Clock} tone="warning" />
                <StatusRow label="Rejected" value={breakdown.rejected} total={totalStatuses} icon={XCircle} tone="danger" />
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl border border-[#e8f5ee] bg-white p-6 shadow-sm"
            >
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-[#1a2a3a]">API Metric Coverage</h3>
                <p className="text-xs text-[#8aa89a]">Only backend-supported analytics are displayed</p>
              </div>
              <div className="space-y-3">
                {[
                  ["Driver signups", true],
                  ["Recruiter signups", true],
                  ["Matches made", true],
                  ["Driver status breakdown", true],
                  ["Moderation turnaround", false],
                  ["Time-series signup trends", false],
                ].map(([label, supported]) => (
                  <div key={label} className="flex items-center justify-between rounded-xl bg-[#f8fbf9] p-3">
                    <span className="text-sm text-[#4a6a5a]">{label}</span>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${supported ? "bg-[#e8f5ee] text-[#2d6a4f]" : "bg-[#fff6df] text-[#8a6a2d]"}`}>
                      {supported ? "Live" : "Backend endpoint needed"}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs leading-5 text-[#8aa89a]">
                The previous mock trend/activity values were removed. The page now renders only data returned by the supplied backend.
              </p>
            </motion.section>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default AdminAnalytics;
