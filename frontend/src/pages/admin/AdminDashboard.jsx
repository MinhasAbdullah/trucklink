import React, { useEffect, useMemo } from "react";
import {
  ArrowRight,
  BarChart3,
  CheckCircle,
  Clock,
  FileText,
  RefreshCw,
  ShieldCheck,
  Truck,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAdminModeration } from "../../context/AdminModerationContext";
import { useAdminRecruiters } from "../../context/AdminRecruitersContext";
import LoadingState from "../../components/ui/LoadingState";
import StatusBadge from "../../components/ui/StatusBadge";

const AdminDashboard = () => {
  const {
    drivers,
    analytics,
    loading,
    analyticsLoading,
    error,
    analyticsError,
    loadDashboard,
  } = useAdminModeration();
  const { recruiters, loading: recruitersLoading, error: recruitersError, loadRecruiters } = useAdminRecruiters();

  useEffect(() => {
    loadDashboard();
    loadRecruiters();
  }, [loadDashboard, loadRecruiters]);

  const activeRecruiters = useMemo(
    () => recruiters.filter((item) => item.status === "active").length,
    [recruiters]
  );
  const pendingRecruiters = useMemo(
    () => recruiters.filter((item) => item.status === "pending").length,
    [recruiters]
  );

  const stats = [
    {
      icon: Truck,
      label: "Driver Signups",
      value: analytics?.total_driver_signups,
      description: "Registered driver accounts",
    },
    {
      icon: FileText,
      label: "Pending Moderation",
      value: analytics?.driver_status_breakdown?.pending,
      description: "Profiles awaiting review",
    },
    {
      icon: Users,
      label: "Recruiters",
      value: analytics?.total_recruiter_signups ?? recruiters.length,
      description: `${activeRecruiters} active · ${pendingRecruiters} pending`,
    },
    {
      icon: BarChart3,
      label: "Matches Made",
      value: analytics?.total_matches_made,
      description: "Recorded platform matches",
    },
  ];

  const loadingEverything = (loading || analyticsLoading || recruitersLoading) && !analytics && !drivers.length && !recruiters.length;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#fff6df] px-3 py-1 text-xs font-semibold text-[#7d683b]">
            <ShieldCheck className="h-3.5 w-3.5" /> Admin overview
          </div>
          <h1 className="text-2xl font-bold text-[#1a2a3a]">Platform Dashboard</h1>
          <p className="text-sm text-[#8aa89a]">Live operational snapshot across moderation, recruiters, and matching</p>
        </div>
        <button
          type="button"
          onClick={() => {
            loadDashboard();
            loadRecruiters();
          }}
          className="flex items-center gap-2 rounded-xl bg-[#2d6a4f] px-4 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-[#1a4a35]"
        >
          <RefreshCw className={`h-4 w-4 ${loading || analyticsLoading || recruitersLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {(error || analyticsError || recruitersError) && (
        <div className="space-y-2">
          {[error, analyticsError, recruitersError].filter(Boolean).map((message) => (
            <div key={message} className="rounded-xl border border-amber-200 bg-[#fff8e8] p-3 text-sm text-[#765f2c]">{message}</div>
          ))}
        </div>
      )}

      {loadingEverything ? (
        <LoadingState label="Loading admin dashboard..." />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            {stats.map(({ icon: Icon, label, value, description }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-[#e8f5ee] bg-white p-5 shadow-sm transition hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8f5ee]">
                  <Icon className="h-5 w-5 text-[#2d6a4f]" />
                </div>
                <p className="mt-4 text-2xl font-bold text-[#1a2a3a]">{value ?? "—"}</p>
                <p className="text-sm font-medium text-[#4a6a5a]">{label}</p>
                <p className="mt-1 text-xs text-[#8aa89a]">{description}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            <section className="overflow-hidden rounded-2xl border border-[#e8f5ee] bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-[#e8f5ee] px-5 py-4">
                <div>
                  <h2 className="font-semibold text-[#1a2a3a]">Moderation Queue Preview</h2>
                  <p className="text-xs text-[#8aa89a]">Pending drivers returned by the moderation API</p>
                </div>
                <Link to="/admin/moderation" className="flex items-center gap-1 text-sm font-semibold text-[#2d6a4f] hover:underline">
                  Open queue <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="divide-y divide-[#eef4ef]">
                {drivers.length ? (
                  drivers.slice(0, 5).map((driver) => (
                    <div key={driver.id} className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-[#f8fbf9]">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#1a2a3a]">{driver.full_name || `Driver #${driver.id}`}</p>
                        <p className="mt-0.5 text-xs text-[#8aa89a]">CDL {driver.cdl_class || "—"} · {driver.years_experience ?? 0} years experience</p>
                      </div>
                      <StatusBadge status={driver.status || "pending"} />
                    </div>
                  ))
                ) : (
                  <div className="px-5 py-10 text-center text-sm text-[#8aa89a]">
                    {error ? "Queue data is unavailable until the backend moderation query is fixed." : "No pending drivers returned by the API."}
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-[#e8f5ee] bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-[#1a2a3a]">Recruiter Accounts</h2>
                  <p className="text-xs text-[#8aa89a]">Current account status</p>
                </div>
                <Users className="h-5 w-5 text-[#2d6a4f]" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-[#e8f5ee] p-4">
                  <div className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-[#2d6a4f]" /><span className="text-sm text-[#4a6a5a]">Active</span></div>
                  <span className="text-xl font-bold text-[#1a2a3a]">{activeRecruiters}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-[#fff6df] p-4">
                  <div className="flex items-center gap-3"><Clock className="h-5 w-5 text-[#9a782f]" /><span className="text-sm text-[#6f6040]">Pending</span></div>
                  <span className="text-xl font-bold text-[#1a2a3a]">{pendingRecruiters}</span>
                </div>
              </div>
              <Link to="/admin/recruiters" className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#dce8e2] px-4 py-2.5 text-sm font-semibold text-[#2d6a4f] transition hover:bg-[#f8fbf9]">
                Manage recruiters <ArrowRight className="h-4 w-4" />
              </Link>
            </section>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default AdminDashboard;
