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

const AdminDashboard = () => {
  const {
    analytics,
    analyticsLoading,
    analyticsError,
    loadAnalytics,
  } = useAdminModeration();
  const { recruiters, loading: recruitersLoading, error: recruitersError, loadRecruiters } = useAdminRecruiters();

  useEffect(() => {
    loadAnalytics();
    loadRecruiters();
  }, [loadAnalytics, loadRecruiters]);

  const activeRecruiters = useMemo(
    () => recruiters.filter((item) => item.status === "active").length,
    [recruiters]
  );
  const pendingRecruiters = useMemo(
    () => recruiters.filter((item) => item.status === "pending").length,
    [recruiters]
  );

  const pendingDrivers = analytics?.driver_status_breakdown?.pending ?? 0;
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
      value: pendingDrivers,
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

  const loadingEverything = (analyticsLoading || recruitersLoading) && !analytics && !recruiters.length;

  const refresh = () => {
    loadAnalytics();
    loadRecruiters();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#fff6df] px-3 py-1 text-xs font-semibold text-[#7d683b]">
            <ShieldCheck className="h-3.5 w-3.5" /> Admin overview
          </div>
          <h1 className="text-2xl font-bold text-[#1a2a3a]">Platform Dashboard</h1>
          <p className="text-sm text-[#8aa89a]">A clear overview of drivers, recruiters, moderation, and matching.</p>
        </div>
        <button
          type="button"
          onClick={refresh}
          className="flex items-center gap-2 rounded-xl bg-[#2d6a4f] px-4 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-[#1a4a35]"
        >
          <RefreshCw className={`h-4 w-4 ${analyticsLoading || recruitersLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {(analyticsError || recruitersError) && (
        <div className="space-y-2">
          {[analyticsError, recruitersError].filter(Boolean).map((message) => (
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

          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <section className="rounded-2xl border border-[#e8f5ee] bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff6df]"><FileText className="h-6 w-6 text-[#8d6c2d]" /></div>
                  <h2 className="mt-4 text-lg font-bold text-[#1a2a3a]">Driver moderation</h2>
                  <p className="mt-1 max-w-xl text-sm text-[#718078]">{pendingDrivers ? `${pendingDrivers} driver profile${pendingDrivers === 1 ? " is" : "s are"} waiting for review.` : "There are currently no pending driver profiles."}</p>
                </div>
                <Link to="/admin/moderation" className="inline-flex items-center justify-center gap-1 rounded-xl bg-[#2d6a4f] px-4 py-2.5 text-sm font-semibold text-white">
                  Open queue <ArrowRight className="h-4 w-4" />
                </Link>
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
